

mapboxgl.accessToken = 'pk.eyJ1IjoidGVua2FrbGV0IiwiYSI6ImNpa2xsZzhlOTAwN2t2cWxzdXpqcHpwa3EifQ.H3dNmbWFhofi9ia3AVPzFA';

$('.confirmed').hide();
$('.deaths').hide();
$('.recovered').hide();


navigator.geolocation.getCurrentPosition(pos => {
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [pos.coords.longitude, pos.coords.latitude],
    zoom: 4
  });


  map.on('click', (e) => {

    $('.no-selection').remove();
    $('.confirmed').show();
    $('.deaths').show();
    $('.recovered').show();

    $.ajax({
      method: 'GET',
      url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${e.lngLat.lat},${e.lngLat.lng}&components=country&key=AIzaSyD8BYoMr1iaJ0wlaQi6flwhM4TKEecPo8Y`
    })
      .done(d => {
        handleAddress(d);
      })
      .fail(f => {
        console.log(f);
      })
  });
});


$.ajax({
  method: 'GET',
  url: 'https://api.covid19api.com/countries'
}).done(done => {
  getCountries(done);
})
  .fail(fail => {
    console.log(fail);
  });

const getCountries = (country) => {
  country.forEach(country => {
    $('.deaths').click(() => {
      getStatus(country.Slug, 'deaths');
    });

    $('.confirmed').click(() => {
      getStatus(country.Slug, 'confirmed');
    });

    $('.recovered').click(() => {
      getStatus(country.Slug, 'recovered');
    });
  });
};

const getStatus = (country, status) => {
  $.ajax({
    method: 'GET',
    url: `https://api.covid19api.com/total/country/${country}/status/${status}`
  })
    .done(done => {
      console.log(done);
    })
    .fail(fail => {
      console.log(fail);
    });
};

const handleAddress = address => {
  function getCountry(addrComponents) {
    for (var i = 0; i < addrComponents.length; i++) {
      if (addrComponents[i].types[0] == 'country') {
        return addrComponents[i].long_name;
      }

      if (addrComponents[i].types.length == 2) {   
        if (addrComponents[i].types[0] == 'political') {
          return addrComponents[i].short_name;
        }
      }
    }
    return false;
  }

  const country = getCountry(address.results[0].address_components);

  const formattedCountry = country.replace(/ +/g, '-').toLowerCase();
  if(formattedCountry === 'united-states') {
    usaConfirm('us');
    usaDeaths('us');
    usaRecovered('us');
  } else {
    countryConfirm(formattedCountry);
    countryDeaths(formattedCountry);
    countryRecovered(formattedCountry);
  }

};

const usaRenderConfirmed = usa => {
  const last = usa[Object.keys(usa)[Object.keys(usa).length - 1]];
  $('#country').text('United States');
  $('#confirmed').text(last.Cases + ' people');
};

const usaRenderDeaths = usa => {
  const last = usa[Object.keys(usa)[Object.keys(usa).length - 1]];
  $('#country').text('United States');
  $('#deaths').text(last.Cases + ' people');
};

const usaRenderRecovered = usa => {
  const last = usa[Object.keys(usa)[Object.keys(usa).length - 1]];
  $('#country').text('United States');
  $('#recovered').text(last.Cases + ' people');
};

const usaConfirm = country => {
  $.ajax({
    method: 'GET',
    url: `https://api.covid19api.com/total/country/${country}/status/confirmed`
  })
    .done(done => {
      usaRenderConfirmed(done);
    })
    .fail(fail => {
      console.log(fail);
    });
};

const usaDeaths = country => {
  $.ajax({
    method: 'GET',
    url: `https://api.covid19api.com/total/country/${country}/status/deaths`
  })
    .done(done => {
      usaRenderDeaths(done);
    })
    .fail(fail => {
      console.log(fail);
    });
};

const usaRecovered = country => {
  $.ajax({
    method: 'GET',
    url: `https://api.covid19api.com/total/country/${country}/status/recovered`
  })
    .done(done => {
      usaRenderRecovered(done);
    })
    .fail(fail => {
      console.log(fail);
    });
};



const countryConfirm = country => {
  $.ajax({
    method: 'GET',
    url: `https://api.covid19api.com/total/country/${country}/status/confirmed`
  })
    .done(done => {
      renderConfirmed(done);
    })
    .fail(fail => {
      console.log(fail);
    });
};

const countryDeaths = country => {
  $.ajax({
    method: 'GET',
    url: `https://api.covid19api.com/total/country/${country}/status/deaths`
  })
    .done(done => {
      renderDeaths(done);
    })
    .fail(fail => {
      console.log(fail);
    });
};

const countryRecovered = country => {
  $.ajax({
    method: 'GET',
    url: `https://api.covid19api.com/total/country/${country}/status/recovered`
  })
    .done(done => {
      renderRecovered(done);
    })
    .fail(fail => {
      console.log(fail);
    });
};

const renderConfirmed = results => {
  const last = results[Object.keys(results)[Object.keys(results).length - 1]];
  $('#country').text(last.Country);
  $('#confirmed').text(last.Cases + ' people');
};


const renderDeaths = results => {
  const last = results[Object.keys(results)[Object.keys(results).length - 1]];
  $('#deaths').text(last.Cases + ' people');
};


const renderRecovered = results => {
  const last = results[Object.keys(results)[Object.keys(results).length - 1]];
  $('#recovered').text(last.Cases + ' people');
};