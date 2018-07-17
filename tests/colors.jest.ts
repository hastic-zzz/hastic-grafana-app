import { ANALYTIC_UNIT_COLORS } from '../src/colors';


var text = 'hello world';

var palette = [
  '#FF99FF',
  '#71b1f9',
  '#aee9fb',
  '#9ce677',
  '#f88990',
  '#f9e26e',
  '#f8c171',
];


describe('basic test', function(){
  it('should return "hello world"', function() {
    expect(text).toBe('hello world')
  })
});

describe('test colors in the palette', function(){
  it('ANALYTIC_UNIT_COLORS should use same palette', function(){
    expect(ANALYTIC_UNIT_COLORS).toEqual(palette)
  })
})
