let getter = require('../index.js');
let expect = require('chai').expect;
let describe = require('mocha').describe;
let it = require('mocha').it;

describe('Test', function () {

   testDIN13();
   testDIN286();
   testDIN2786();

});

function testDIN13 () {
   describe('DIN13 Test 1', function () {
      it('Correct Parameter-Combination -> Value Expected', function () {
         var actual = getter.ToleranceForDIN13(100, true, 6, 'H', 6);
         expect({'minimum': -3.897114317029974, 'maximum': -3.497114317029974}).to.eql(actual.pitchDiameter);
      });
   });

   describe('DIN13 Test 2', function () {
      it('Correct Parameter-Combination -> Value Expected', function () {
         var actual = getter.ToleranceForDIN13(100, false, 6, 'g', 6);
         expect({'minimum': -4.277114317029974, 'maximum': -3.977114317029974}).to.eql(actual.pitchDiameter);
      });
   });

   describe('DIN13 Test 3', function () {
      it('Invalid Parameter-Combination -> null is expected Value', function () {
         var actual = getter.ToleranceForDIN13(666, false, 6, 'g', 6);
         expect(null).to.eql(actual);
      });
   });

   describe('DIN13 Test 4 Unknown Type', function () {
      it('Invalid Parameter-Combination -> null is expected Value', function () {
         var actual = getter.ToleranceForDIN13(666, false, 6, 'xx', 6);
         expect(null).to.eql(actual);
      });
   });

   describe('DIN13 Test 5 Parameters all NULL', function () {
      it('Invalid Parameter-Combination -> null is expected Value', function () {
         var actual = getter.ToleranceForDIN13(null, null, null, null, null);
         expect(null).to.eql(actual);
      });
   });

   describe('DIN13 Test 6 toleranceDeviation all NULL', function () {
      it('Invalid Parameter-Combination -> null is expected Value', function () {
         var actual = getter.ToleranceForDIN13(100, false, 6, null, 6);
         expect(null).to.eql(actual);
      });
   });
}

function testDIN286 () {
   describe('DIN286 Test 1', function () {
      it('Correct Parameter-Combination -> Value Expected', function () {
         var actual = getter.ToleranceForDIN286(45, 'H', 7);
         expect({'range': 0.025, 'minimum': 0, 'maximum': 0.025}).to.eql(actual);
      });
   });

   describe('DIN286 Test 2', function () {
      it('Correct Parameter-Combination -> Value Expected', function () {
         var actual = getter.ToleranceForDIN286(45, 'ZB', 6);
         expect({'range': 0.016, 'minimum': -0.253, 'maximum': -0.237}).to.eql(actual);
      });
   });

   describe('DIN286 Test 3', function () {
      it('Correct Parameter-Combination -> Value Expected', function () {
         var actual = getter.ToleranceForDIN286(45, 'k', 8);
         expect({'range': 0.039, 'minimum': 0, 'maximum': 0.039}).to.eql(actual);
      });
   });

   describe('DIN286 Test 4', function () {
      it('Correct Parameter-Combination -> Value Expected', function () {
         var actual = getter.ToleranceForDIN286(45, 'js', 8);
         expect({'range': 0.039, 'minimum': -0.0195, 'maximum': 0.0195}).to.eql(actual);
      });
   });

   describe('DIN286 Test 5', function () {
      it('Correct Parameter-Combination -> Value Expected', function () {
         var actual = getter.ToleranceForDIN286(45, 'za', 8);
         expect({'range': 0.039, 'minimum': 0.18, 'maximum': 0.219}).to.eql(actual);
      });
   });

   describe('DIN286 Test 6', function () {
      it('Correct Parameter-Combination -> Value Expected', function () {
         var actual = getter.ToleranceForDIN286(45, 'm', 6);
         expect({'range': 0.016, 'minimum': 0.009, 'maximum': 0.025}).to.eql(actual);
      });
   });

   describe('DIN286 Test 7 Unknown Type', function () {
      it('Invalid Parameter-Combination -> NULL expected', function () {
         var actual = getter.ToleranceForDIN286(45, 'xxx', 6);
         expect(null).to.eql(actual);
      });
   });

   describe('DIN286 Test 8 Unknown Value', function () {
      it('Invalid Parameter-Combination -> NULL expected', function () {
         var actual = getter.ToleranceForDIN286(45, 'm', 6666);
         expect(null).to.eql(actual);
      });
   });

   describe('DIN286 Test 9 Unknown nominal', function () {
      it('Invalid Parameter-Combination -> NULL expected', function () {
         var actual = getter.ToleranceForDIN286(-1, 'm', 6);
         expect(null).to.eql(actual);
      });
   });

   describe('DIN286 Test 10 Parameters all null', function () {
      it('Invalid Parameter-Combination -> NULL expected', function () {
         var actual = getter.ToleranceForDIN286(null, null, null);
         expect(null).to.eql(actual);
      });
   });

}

function testDIN2786 () {
   describe('DIN2768 Test 1 length', function () {
      it('Correct Parameter-Combination -> Value Expected', function () {
         var actual = getter.ToleranceForDIN2768('length', 'm', 45);
         expect({'range': 0.6, 'minimum': -0.3, 'maximum': 0.3}).to.eql(actual);
      });
   });

   describe('DIN2768 Test 2 length', function () {
      it('Correct Parameter-Combination -> Value Expected', function () {
         var actual = getter.ToleranceForDIN2768('length', 'c', 45);
         expect({'range': 1.6, 'minimum': -0.8, 'maximum': 0.8}).to.eql(actual);
      });
   });

   describe('DIN2768 Test 3 length', function () {
      it('Correct Parameter-Combination -> Value Expected', function () {
         var actual = getter.ToleranceForDIN2768('length', 'm', 175);
         expect({'range': 1, 'minimum': -0.5, 'maximum': 0.5}).to.eql(actual);
      });
   });

   describe('DIN2768 Test 4 length', function () {
      it('Correct Parameter-Combination -> Value Expected', function () {
         var actual = getter.ToleranceForDIN2768('length', 'c', 175);
         expect({'range': 2.4, 'minimum': -1.2, 'maximum': 1.2}).to.eql(actual);
      });
   });

   describe('DIN2768 Test 5 length', function () {
      it('Invalid Parameter-Combination -> NULL Expected', function () {
         var actual = getter.ToleranceForDIN2768('length', 'cx', 666);
         expect(null).to.eql(actual);
      });
   });

   describe('DIN2768 Test 6 radius', function () {
      it('Correct Parameter-Combination -> Value Expected', function () {
         var actual = getter.ToleranceForDIN2768('radius', 'm', 2);
         expect({minimum: -0.2, maximum: 0.2, range: 0.4}).to.eql(actual);
      });
   });

   describe('DIN2768 Test 7 radius', function () {
      it('Correct Parameter-Combination -> Value Expected', function () {
         var actual = getter.ToleranceForDIN2768('radius', 'f', 2);
         expect({minimum: -0.2, maximum: 0.2, range: 0.4}).to.eql(actual);
      });
   });

   describe('DIN2768 Test 8 radius', function () {
      it('Correct Parameter-Combination -> Value Expected', function () {
         var actual = getter.ToleranceForDIN2768('radius', 'v', 2);
         expect({minimum: -0.4, maximum: 0.4, range: 0.8}).to.eql(actual);
      });
   });

   describe('DIN2768 Test 9 radius', function () {
      it('Correct Parameter-Combination -> Value Expected', function () {
         var actual = getter.ToleranceForDIN2768('radius', 'c', 2);
         expect({minimum: -0.4, maximum: 0.4, range: 0.8}).to.eql(actual);
      });
   });

   describe('DIN2768 Test 10 Unknown Type', function () {
      it('Invalid Parameter-Combination -> NULL Expected', function () {
         var actual = getter.ToleranceForDIN2768('radius', 'x', 666);
         expect(null).to.eql(actual);
      });
   });

   describe('DIN2768 Test 11 Parameter all null', function () {
      it('Invalid Parameter-Combination -> NULL Expected', function () {
         var actual = getter.ToleranceForDIN2768(null, null, null);
         expect(null).to.eql(actual);
      });
   });
}
