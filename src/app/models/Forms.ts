export interface FormControlObject {
    key: string,
    type: string,
    option: Options,
    hidden?:boolean
  }
  
  export interface Options {
    label?: string,
    placeholder?: string,
    required?: boolean,
    pattern?: string,
    type?: string,
    list?: Array<any>
  }