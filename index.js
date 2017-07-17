$( document ).ready(() => {
  renderPoem();
  $('.tooltipped').tooltip({delay: 100});
  $('.modal').modal();
});

function randomIndex(arr){
  var picked = Math.floor(Math.random()*arr.length);
  return picked;
}

function logResults(json){
  console.log(json);
}

function getEntry(search, cb){
  var $xhr = $.getJSON(`http://words.bighugelabs.com/api/2/d7bcd8ea6ee64959da7b188de9178dbc/${search}/json`)

  const $modal = $('.modal-content');

  $xhr.done(function(data) {
    if ($xhr.status !== 200) {
      return;
    }
    $modal.empty();
    cb(data);
    console.log(data);

  });

  $xhr.fail(function(err) {
    const $modalErr = $('<h3>');
    $modalErr.text('Sorry nothing here');
    $modal.empty();
    $modal.append($modalErr);
    console.log(err);
  });
}

function getPoem(search, cb){
  var $xhr = $.getJSON(`https://cors-anywhere.herokuapp.com/http://poetrydb.org/${search}`)

  $xhr.done(function(data) {
    if ($xhr.status !== 200) {
      return;
    }
    cb(data);
    console.log(data);

  });

  $xhr.fail(function(err) {
      console.log(err);
  });
}

function wordFilter(inputword){
  var word = inputword.toLowerCase();
  word = word.replace(/[\)\(\[\]\,\:\;\!\?\*\.\‘\‛\’\′\´\`\‑\—\–\‒0-9]|('d)|('s)/g , '');
  if(word.includes("'")){
    console.log(word);
  }
  return word;
}

function renderPoem(){
  const $author = $('#author');
  const $title = $('#title');
  const $lines = $('#lines');
  getPoem('author', function(info){
    console.log(info);
    var randomAuthor = info.authors[randomIndex(info.authors)];
    console.log(randomAuthor);
    $author.text('By: ' + randomAuthor);
    getPoem(`author/${randomAuthor}/title`, (info) => {
      console.log(info);
      var randomTitle = info[randomIndex(info)].title;
      console.log(randomTitle);
      $title.text(randomTitle);
      getPoem(`title/${randomTitle}`, (info) => {
        console.log(info[0].lines);
        var randomLines = info[0].lines;
        $lines.empty();
        randomLines.forEach( (string) => {
          var wordArr = [];
          var words = string.split(' ');
          var $line = $('<span>');
          var $row = $('<div>');
          $line.attr('class', 'row');
            words.forEach( (word) => {
              var $wordElement = $('<a>');
              var $wordElementSpan = $('<span>');
              var $space = $('<span>');
              if(word.match(/\b[^\s]{1,}(-)[^\s]{1,}\b/g)){
                var wordSC = word.split('-');
                wordSC.forEach( (word) => {
                  $space.text('-');
                  $wordElementSpan.text(word);
                  $wordElementSpan.attr('data-id', wordFilter(word));
                  $wordElementSpan.addClass('white-text');
                  $wordElement.addClass('model-open');
                  $wordElement.attr('href', '#modal1');
                  $wordElement.append($wordElementSpan);
                  $row.append($wordElement);
                  $row.append($space);
                });
              }else{
                $space.text(' ');
                $wordElementSpan.text(word);
                $wordElementSpan.attr('data-id', wordFilter(word));
                $wordElementSpan.addClass('white-text');
                $wordElement.addClass('model-open');
                $wordElement.attr('href', '#modal1');
                $wordElement.append($wordElementSpan);
                $row.append($wordElement);
                $row.append($space);
              }

            });
          $lines.append($row);
        });
      });
    });
  });

}

function loopGen(spacer){

}

function renderEntry(e) {
  const $modal = $('.modal-content');
  const $modalH = $('<h3>');
  console.log(e.target.attributes['data-id'].value);
  $modalH.text(e.target.attributes['data-id'].value.toUpperCase());
  getEntry(e.target.attributes['data-id'].value, (info) => {
    $modal.append($modalH);
    for (var key in info){
      var keys = Object.keys(info);
      const $section = $('<div>');
      const $pOST = $('<h4>');
      const $sP = $('<p>');
      function capital(key) {
          var result = key[0].toUpperCase() + key.slice(1, key.length);
          return result;
        }
      $pOST.text(capital(key));
      for (var xWT in info[key]){
        const $wT = $('<h5>');
        const $words = $('<p>');
        var wTKeys = Object.keys(key);
        switch (true) {
          case xWT === 'syn':
            $wT.text('Synonyms');
            break;
          case xWT === 'ant':
            $wT.text('Antonyms');
            break;
          case xWT === 'rel':
            $wT.text('Related terms');
            break;
          case xWT === 'sim':
            $wT.text('Similar terms');
            break;
          case xWT === 'usr':
            $wT.text('User suggestions');
            break;
        }
        console.log(xWT);
        $words.text(info[key][xWT].join(', '));
        $sP.append($wT);
        $sP.append($words);
      }
      $section.append($pOST);
      $section.append($sP);
      $modal.append($section);
    }
    console.log(info);
  });
}

$('.card-panel').on('click', (e) => {
  renderEntry(e);
});

$('button').on('click', (e) => {
  e.preventDefault();
  renderPoem();
});
