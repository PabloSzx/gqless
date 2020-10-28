import { Extension } from './Extension'
import { UNodeExtension } from './NodeExtension'
import { DataTrait } from '../traits'
import { computed } from '@gqless/utils'

export class ComputableExtension extends Extension {
  constructor(
    parent: Extension | undefined,
    node: DataTrait,
    public getData: (data: any) => UNodeExtension,
    keyedBy?: any
  ) {
    super(parent, node, keyedBy)
  }

  @computed
  // @ts-ignore
  public get data() {
    // TODO: (Optimization) Could instead return data from an instance of ComputedExtension
    // if available. ChildField could then return already-computed instances
    return this.getData(null)
  }
}
