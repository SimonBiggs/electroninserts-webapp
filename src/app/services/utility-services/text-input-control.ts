import { validateInput } from './sanitise-validation'

export class TextInputControl {
  public textboxInput: {}
  public textboxValid: {}
  
  constructor(
    public inputNames: string[],
    public dataInputs: {}
  ) {
    this.textboxInput = {}
    this.textboxValid = {}

    for (let key of this.inputNames) {
      this.textboxInput[key] = ""
      this.textboxValid[key] = true
    }
  }

  updateAllTextboxInputs() {
    for (let key of this.inputNames) {
      this.updateTextboxInput(key)
    }
  }

  updateTextboxInput(key: string) {
    this.textboxInput[key] = String(this.dataInputs[key])
      .replace(/,/g, ', ')
  }

  validateTextboxInput(key: string, newInput:string) {
    this.textboxValid[key] = false
    try {
      if (validateInput(newInput)) {
        this.dataInputs[key] = eval('[' + newInput.replace(/[,;\n\t]\s*/g, ', ') + ']')
        this.textboxValid[key] = true
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  checkAllValid() {
    for (let key of this.inputNames) {
      if (!this.textboxValid[key]) {
        return false
      }
    }
    return true
  }
}