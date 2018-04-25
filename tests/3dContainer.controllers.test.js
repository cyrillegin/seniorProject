import {assert} from 'chai';
import CurvesController from '../src/client/components/3dContainer/controllers/curves.controller.js'; //THREE not defined ERROR
//import MeshController from '../src/client/components/3dContainer/controllers/mesh.controller.js'; THREE not defined ERROR

describe('curves.controller.js', () => {

  const curveAttributes = {
    start : [0,0,0],
    end : [0,0,0],
    startControl : [0,0,0],
    endControl : [0,0,0],
    verticies : [],
  };

  const boat = {
        aftBeam: curveAttributes,
        aftChine : curveAttributes,
        aftKeel : curveAttributes,
        foreBeam: curveAttributes,
        foreChine : curveAttributes,
        foreKeel : curveAttributes,
    };

  const frame = {
        distanceFromBack : 0,
  };

  const key = 'aft';

  const base = [0,0,0];
  const offset = [0,0,0];

  const location = null; //needs value

  let curveParam = null;

  beforeEach(() => {
      curveParam = new CurvesController();
  });

  it.skip('buildCurve', () => {
      assert.isNotNull(curveParam.buildCurve(curveAttributes, key));
    });

  it.skip('defineCurve', () => {
      assert.isNotNull(curveParam.buildCurve(curveAttributes, key));
    });

  it.skip('drawCurvePoint', () => {
      assert.isNotNull(curveParam.buildCurve(location));
    });

  it.skip('drawCurveControlPoint', () => {
      assert.isNotNull(curveParam.drawCurveControlPoint(base, offset));
    });

  it.skip('drawControlLine', () => {
      assert.isNotNull(curveParam.drawControlLine(curveAttributes.start, curveAttributes.end));
    });

  it.skip('drawLine', () => {
      assert.isNotNull(curveParam.drawControlLine(curveAttributes.start, curveAttributes.end, 'test'));
    });

  it.skip('findLocation', () => {
      assert.isNotNull(curveParam.findLocation(boat, frame));
    });
});


describe('mesh.controller.js', () => {

  const Curve = {
    start : [0,0,0],
    end : [0,0,0],
    startControl : [0,0,0],
    endControl : [0,0,0],
    verticies : [],
  };

const boat = {
      width : 1,
      length : 1,
      height : 1,
      frames : 1,
      aftCurveBeamLeft : Curve,
      foreCurveBeamLeft : Curve,
      aftCurveBeamRightight : Curve,
      foreCurveBeam : Curve,
      aftCurveKeelLeft : Curve,
      foreCurveKeelLeft : Curve,
      aftCurveKeelCenter : Curve,
      foreCurveKeelCenter : Curve,
      aftCurveKeelRight : Curve,
      foreCurveKeelRight : Curve,

      aftBeamKeelLeft : Curve,
      aftBeamKeelRight : Curve,
      foreBeamKeelLeft : Curve,
      foreBeamKeelRight : Curve,

      aftKeelLeft : Curve,
      aftKeelRight : Curve,
      foreKeelLeft : Curve,
      foreKeelRight : Curve,

      aftBeamLeft : Curve,
      aftBeamRight : Curve,
      foreBeamLeft : Curve,
      foreBeamRight : Curve,
  };

  let meshParam = null;

  beforeEach(() => {
      meshParam = new MeshController();
  });

  it.skip('defineGeometry', () => {
      assert.isNotNull(MeshController.defineGeometry(boat));
    });

  it.skip('drawFace', () => {
      assert.isNotNull(MeshController.drawFace(Curve, Curve));
    });

  it.skip('defineUvs', () => {
      assert.isNotNull(MeshController.defineUvs(drawFace(Curve, Curve)));
    });

});
