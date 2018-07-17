import colors, { ANALYTIC_UNIT_COLORS } from '../src/colors';
import { AnalyticController } from '../src/controllers/analytic_controller';
import { AnalyticUnit } from '../src/models/analytic_unit';


var palette = [
  '#FF99FF',
  '#71b1f9',
  '#aee9fb',
  '#9ce677',
  '#f88990',
  '#f9e26e',
  '#f8c171',
];

describe('test colors in the palette', function(){
  it('ANALYTIC_UNIT_COLORS should use same palette', function(){
    expect(ANALYTIC_UNIT_COLORS).toEqual(palette)
  })
});

var createArray = function() {
  var AuArray = [];
  var AuColors = [];
  var i = 0;
  while(i < 10){
    AuArray.push(new AnalyticUnit);
    AuColors.push(AuArray[i].color);
    i++;
  };
  console.log(AuColors);
}
createArray();

/*describe('Compare Au color to correspond to palette', function() {
  it('should compare create an AU with the first color of the palette',function(){
    expect(AnalyticUnit1.color).toBe(palette[0])
  })
})
*/
