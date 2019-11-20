const sinon = require('sinon');
const proxyquire = require('proxyquire');
const data = require('../../lib/data.json');
const totalCountries = Object.keys(data).length;
const buildCountryMock = sinon.spy(function(country) {
  return { id: country.i2 };
});

describe('Countries cache', () => {
  let countriesDB;

  beforeEach(() => {
    buildCountryMock.resetHistory();

    countriesDB = proxyquire('../../lib', {
      './build-country': buildCountryMock
    });
  });

  it('should call "buildContry" once when requesting a single country', () => {
    countriesDB.getCountry('MX');
    expect(buildCountryMock.callCount).to.be.equal(1);
  });

  it('should call "buildContry" once when requesting the same country multiple times', () => {
    countriesDB.getCountry('MX');
    countriesDB.getCountry('MX');
    expect(buildCountryMock.callCount).to.be.equal(1);
  });

  it('should call "buildContry" method once for each country when requesting all', () => {
    countriesDB.getAllCountries();
    expect(buildCountryMock.callCount).to.be.equal(totalCountries);
  });

  it('should cache all countries to minimize "buildContry" calls', () => {
    countriesDB.getAllCountries();
    countriesDB.getAllCountries();
    expect(buildCountryMock.callCount).to.be.equal(totalCountries);
  });

  it('should cache countries incrementally', () => {
    countriesDB.getCountry('MX');
    expect(buildCountryMock.callCount).to.be.equal(1);
    countriesDB.getCountry('MX');
    expect(buildCountryMock.callCount).to.be.equal(1);
    countriesDB.getCountry('US');
    expect(buildCountryMock.callCount).to.be.equal(2);
    countriesDB.getAllCountries();
    expect(buildCountryMock.callCount).to.be.equal(totalCountries);
    countriesDB.getCountry('MX');
    expect(buildCountryMock.callCount).to.be.equal(totalCountries);
    countriesDB.getAllCountries();
    expect(buildCountryMock.callCount).to.be.equal(totalCountries);
  });
});
