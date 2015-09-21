import assert from 'assert';
import Person from '../lib';

describe('brawl', function () {
  it('should have unit test!', function () {
    const dude = new Person('Nico');
    assert(dude.getName() === 'Nico', 'we expected this package author to add actual unit tests.');
  });
});
