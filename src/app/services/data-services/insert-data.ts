
export class Coordinates {
  public x: number[]
  public y: number[]

  constructor() {
    this.x = [0]
    this.y = [0]
  }
}


export class Parameterisation {
  public parameterisationKey: string
  public width: number
  public length: number

  insert: Coordinates
  circle: Coordinates
  ellipse: Coordinates

  constructor() {
    this.insert = new Coordinates()
    this.circle = new Coordinates()
    this.ellipse = new Coordinates()
  }

  insertUpdated() {
    if (this.insert != null) {
      
      this.parameterisationKey = (
        '{"x":' + JSON.stringify(this.insert.x) + ',' +
        '"y":' + JSON.stringify(this.insert.y) +
        '}')
    }
    else {
      throw new RangeError('Insert was not defined. Cannot run insert updated.')
    }

  }

  reset() {
    this.parameterisationKey = null

    for (let key of ['insert', 'circle', 'ellipse']) {
      this[key] = new Coordinates()
      this[key].x = [0]
      this[key].y = [0]
    }

    this.width = null
    this.length = null
  }
}


export class InsertData {
  public id: number
  public machine: string
  public energy: number
  public applicator: string
  public ssd: number
  public measuredFactor: number

  public parameterisation: Parameterisation

  constructor(inputId?: number) {
    this.parameterisation = new Parameterisation()
    if (inputId != null) {
      this.id = inputId
    }
    else {
      this.id = 0
    }    
  }

  reset() {
    this.machine = null
    this.parameterisation.reset()
    this.energy = null
    this.applicator = null
    this.ssd = null
    this.measuredFactor = null
  }

  fillFromObject(object: {}) {
    for (let key of ['machine', 'energy', 'applicator', 'ssd', 'measuredFactor']) {
      this[key] = object[key]
    }
    this.parameterisation.insert = object['parameterisation'].insert
    this.parameterisation.insertUpdated()
  }
}
