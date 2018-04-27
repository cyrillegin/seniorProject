import {assert} from 'chai';
import {applyOffsets} from '../src/client/utility/calculations.js';
import {casteljauPoint} from '../src/client/utility/calculations.js';
import {casteljauFromY} from '../src/client/utility/calculations.js';
import mirrorX from '../src/client/utility/mirror.js';


describe('calculations.js', () => {

  const Curve = {
    start : [0,0,0],
    end : [0,0,0],
    startControl : [0,0,0],
    endControl : [0,0,0],
    verticies : [],
  };

const boat = {
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

  const keyAft = 'aft';
  const keyBeam = 'beam';
  const keyKeel = 'keel';
  const t = 0;

   it('applyOffsets, Key=aft', () => {
       assert.isNotNull(applyOffsets(boat, Curve, keyAft));
     });

   it('applyOffsets, Key=beam', () => {
       assert.isNotNull(applyOffsets(boat, Curve, keyBeam));
     });

   it('applyOffsets, Key=keel', () => {
       assert.isNotNull(applyOffsets(boat, Curve, keyKeel));
     });

   it('casteljauPoint', () => {
       assert.isNotNull(casteljauPoint(Curve, t));
    });

   it('casteljauFromY', () => {
       assert.isNotNull(casteljauFromY(Curve, t));
    });

   it.skip('conver3dTo2dCoordinates', () => {
       assert.isNotNull(conver3dTo2dCoordinates());
    });

});


describe('mirror.js', () => {

  const Curve = {
    start : [1,1,1],
    end : [1,1,1],
    startControl : [1,1,1],
    endControl : [1,1,1],
  }

  var end = Curve;

  end = mirrorX(Curve);

  it('mirrorX, start[0]', () => {
      assert.equal(end.start[0], -1);
   });

  it('mirrorX, end[0]', () => {
     assert.equal(end.end[0], -1);
   });

   it('mirrorX, startControl[0]', () => {
      assert.equal(end.startControl[0], -1);
   });

   it('mirrorX, endControl[0]', () => {
      assert.equal(end.endControl[0], -1);
    });

});
    // const mesh = {
    //     main: {
    //         children: [{
    //             scale: {
    //                 x: 0,
    //                 y: 0,
    //                 z: 0,
    //             },
    //         }],
    //     },
    // };
    // let manipulator = null;
    //
    // beforeEach(() => {
    //     manipulator = new Manipulate(mesh);
    // });

    // it('Adjust the width of the mesh.', () => {
    //     manipulator.adjustWidth(100);
    //     assert(mesh.main.children[0].scale.z === 1.5);
    // });
    //
    // it('Adjust the height of the mesh.', () => {
    //     manipulator.adjustHeight(100);
    //     assert(mesh.main.children[0].scale.y === 1.5);
    // });
    //
    // it('Adjust the length of the mesh.', () => {
    //     manipulator.adjustLength(100);
    //     assert(mesh.main.children[0].scale.x === 1.5);
    // });
//});
