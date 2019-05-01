import { AnalyticUnit, AnalyticUnitId } from './analytic_unit';
import { PatternAnalyticUnit } from './pattern_analytic_unit';

export class AnalyticUnitsSet {

  private _mapIdIndex: Map<AnalyticUnitId, number>;
  private _items: AnalyticUnit[];

  constructor(private _serverObject: any[]) {
    if (_serverObject === undefined) {
      throw new Error('server object can`t be undefined');
    }
    this._mapIdIndex = new Map<AnalyticUnitId, number>();
    this._items = _serverObject.map(p => new PatternAnalyticUnit(p));
    this._rebuildIndex();
  }

  get items() { return this._items; }

  addItem(item: AnalyticUnit) {
    this._serverObject.push(item.serverObject);
    this._mapIdIndex[item.id] = this._items.length;
    this._items.push(item);
  }

  removeItem(id: AnalyticUnitId) {
    var index = this._mapIdIndex[id];
    this._serverObject.splice(index, 1);
    this._items.splice(index, 1);
    this._rebuildIndex();
  }

  _rebuildIndex() {
    this._items.forEach((a, i) => {
      this._mapIdIndex[a.id] = i;
    });
  }

  byId(id: AnalyticUnitId): AnalyticUnit {
    return this._items[this._mapIdIndex[id]];
  }

  byIndex(index: number): AnalyticUnit {
    return this._items[index];
  }
}
