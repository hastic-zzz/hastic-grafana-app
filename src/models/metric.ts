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

export class Metric {
  constructor(private _panelObj: any) {
    if(_panelObj === undefined) {
      throw new Error('_panelObj is undefined');
    }
  }
  get datasource(): string { return this._panelObj.datasource; }
  get targetHashs(): TargetHash[] { return this._panelObj.targetHashs; }
}

export class MetricExpanded {
  private _targets: Target[];
  constructor(public datasource: string, targets: any[]) {
    const visibleTargets = targets.filter(target => !target.hide);
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

export class MetricMap {
  private _cache: Map<TargetHash, Target> = new Map<TargetHash, Target>();
  constructor(datasource: string, targets: Target[]) {
    targets.forEach(t => {
      this._cache.set(t.getHash(), t);
    });
  }
}
