export class Base {
  protected propNames: string[]
  protected keyConversions: {}

  reset() {
    for (let propName of this.propNames) {
      this[propName] = []
    }
  }

  fillFromObject(object: {}) {
    object = this.updateOldKeyNames(object)
    for (let propName of this.propNames) {
      if (object[propName] == null) {
        this[propName] = []
      }
      else {
        this[propName] = object[propName]
      }
    }
  }

  updateOldKeyNames(object: {}) {
    let newKey: string

    for (let oldKey in this.keyConversions) {
      if (object[oldKey] != null && object[this.keyConversions[oldKey]] == null) {
        newKey = this.keyConversions[oldKey]
        Object.defineProperty(object, newKey,
            Object.getOwnPropertyDescriptor(object, oldKey));
        delete object[oldKey];
      }
    }

    return object
  }
}