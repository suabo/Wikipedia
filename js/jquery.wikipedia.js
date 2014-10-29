/* 
 *  jQuery Plugin - Wikipedia V1.0
 *  
 *  todo: add description here
 *  
 *  Autor: Marcel Grolms - www.suabo.de 2013
 */ 
$.fn.WikipediaWidget = function(wikipediaPage, options) {  
  //init defaults
  var settings = {
    showTitle: true,
    maxThumbnails: 3,
    cutFirstInfoTableRows: 4,
    maxInfoTableRows: 8,
    thumbMaxWidth : '180px',
    thumbMaxHeight: '180px',
    locale: 'de',
  };
  
  //option handling
  
  if(options != undefined) {
    //we got more options
    $.extend(settings, options);
  }
    
  //check if pagetitle ist set
  if(wikipediaPage == undefined) { console.log('Kein Wikipedia Suchtitel!Keine Abfrage gestartet!');return; }        
  //init given wikiContainer from the Selector init
  var wikiContainer = this;      
  wikiContainer.append('<div class="ajaxLoading"><img src="img/ajax-loader.gif"></div>');
  //get data.parse.images
  $.getJSON('http://'+settings.locale+'.wikipedia.org/w/api.php?action=parse&format=json&callback=?', {page:wikipediaPage, prop:'text|images', uselang: settings.locale}, function(parsedata) {
    //remove loading image
    wikiContainer.find('.ajaxLoading').remove();
    //debug
    //console.log(parsedata);
    //drop text to div container
    var content = $(parsedata.parse.text["*"]).wrap('<div></div>').parent();                
    //insert title
    if(settings.showTitle) {
      wikiContainer.append('<div class="wikipediaTitle"></div>').find('.wikipediaTitle').html(parsedata.parse.title);
    }
    //get images of right side table
    var rightTableImages = content.find('table a.image img');        
    //append first image to main container  
    wikiContainer.append($(rightTableImages).first().removeAttr('srcset').removeAttr('height').removeAttr('width').wrap('<div class="wikipediaLogo"></div>').parent());
    //append description to main container
    var description = content.find('p').first().text();
    wikiContainer.append('<div class="wikipediaDescription"></div>').find('.wikipediaDescription').append(description);
    //get thumbnail images
    var rightThumbnails = content.find('.thumb a.image img');
    wikiContainer.append('<ul class="wikipediaThumbGallery"></ul>');
    //add settings.maxThumbnails to main container
    $.each(rightThumbnails, function(index, Thumbnail) {
      //add thumb with thumbMaxHeight and thumbMaxWidth
      if(index<settings.maxThumbnails) wikiContainer.find('.wikipediaThumbGallery').append($(Thumbnail).removeAttr('srcset').removeAttr('height').removeAttr('width').css({'width': 'auto', 'height': 'auto', 'max-width': settings.thumbMaxWidth, 'max-height': settings.thumbMaxHeight}).wrap('<li class="wikipediaThumbnail"></li>').parent());  
    });
    //get right side table
    var rightTable = content.find('table.infobox, table.float-right').first();
    //init new table
    var newTable = $('<table class="wikipediaInfoTable"></table>');
    //parse new table from right side table with cutFirstInfoTable and settings.maxInfoTableRows
    $.each(rightTable.find('tr'), function(index, element) {
      if(index>settings.cutFirstInfoTableRows && index<(settings.cutFirstInfoTableRows+settings.maxInfoTableRows)) newTable.append(element);
    });
    //append new table to main container
    wikiContainer.append(newTable);
    wikiContainer.append($('<div class="clear"></div>'));                        
  });  
};
