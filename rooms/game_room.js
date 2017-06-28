var Room = require('colyseus').Room
let lastLoop = new Date

class GameRoom extends Room {

  constructor (options) {
    super( options )

    // Broadcast patched state to all connected clients at 20fps (50ms)
    this.setPatchRate( 1000 / 20 )

    // // Call this function if you intend to implement delay compensation
    // // techniques in your game
    // this.useTimeline()

    // Call game simulation at 60fps (16.6ms)
    this.setSimulationInterval( this.tick.bind(this), 1000 / 60 )

    this.setState({ entities: [] })
  }

  requestJoin(options) {
    // only allow 10 clients per room
    return this.clients.length < 10;
  }

  onJoin (client) {
    console.log(client.id, "joined GameRoom!")
    this.state.entities.push({
      id: client.id,
      pos: {
        x: 10,
        y: 10
      },
      moveDir: {
        x: 0,
        y: 0,
        _x: 0,
        _y: 0
      },
      color: require('randomcolor')()
    })
  }

  onMessage (client, data) {
    console.log(client.id, "sent message on ChatRoom", data)

    switch (data.type) {
      case "move":
        console.log('move')
        this.state.entities[data.id].moveDir.x = data.data.x
        this.state.entities[data.id].moveDir.y = data.data.y
        break;
      default:
        console.log('unknown message recieved from', client.id)
    }
  }

  tick () {
    let thisLoop = new Date
    let dt = thisLoop - lastLoop
    lastLoop = thisLoop

    this.state.entities.forEach(entity => {
      entity.moveDir._x += (entity.moveDir.x - entity.moveDir._x) * 0.1
      entity.moveDir._y += (entity.moveDir.y - entity.moveDir._y) * 0.1
      entity.pos.x += entity.moveDir._x * dt * 0.2
      entity.pos.y += entity.moveDir._y * dt * 0.2
    })
    //
    // This is your 'game loop'.
    // Inside function you'll have to run the simulation of your game.
    //
    // You should:
    // - move entities
    // - check for collisions
    // - update the state
    //

    // // Uncomment this line to see the simulation running and clients receiving the patched state
    // // In this example, the server simply adds the elapsedTime every 2 messages it receives
    // if ( this.state.messages.length % 3 == 0 ) {
    //   this.state.messages.push(`${ this.clock.elapsedTime }: even`)
    // }
  }

  onLeave (client) {
    console.log(client.id, "left ChatRoom")
  }

}

module.exports = GameRoom
