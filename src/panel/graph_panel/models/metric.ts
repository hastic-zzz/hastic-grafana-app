import _ from 'lodash';
import md5 from 'md5';


export type TargetHash = string;

export class Target {
  private _data: any;
  constructor(any) {
    this._data = _.cloneDeep(any);
    this._strip();
  }

  private _strip() {
    delete this._data.alias;
  }

  getHash(): TargetHash {
    return md5(JSON.stringify(this._data));
  }

  getJSON() {
    return this._data;
  }
}

export class MetricExpanded {
  private _targets: Target[];
  constructor(public datasource: string, targets: any[]) {
    const visibleTargets = targets.filter(target => !target.hide);
    if(visibleTargets.length === 0) {
      throw new Error('There are no visible metrics. Please add at least one metric');
    }
    if(visibleTargets.length > 1) {
      throw new Error('Multiple metrics are not supported currently');
    }
    this._targets = visibleTargets.map(t => new Target(t));
  }

  toJSON(): any {
    return {
      datasource: this.datasource,
      targets: this._targets.map(t => t.getJSON())
    }
  }
}
