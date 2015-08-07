/* 
 *  jQuery Plugin - Wikipedia V2.0
 *  
 *  todo: add description here
 *  
 *  Autor: 
 *      Version 1.0 : Marcel Grolms - www.suabo.de 2013
 *      Version 2.0 : Laurens Laman - https://github.com/LauLaman 
 *  
 */
(function($){
    //-- declare var in global scope
    window.Wikipedia = {};
    var Wiki = {
        settings: {
            showTitle: false,
            showInfo: true,
            maxThumbnails: 0,
            cutFirstInfoTableRows: 0,
            maxInfoTableRows: 0,
            thumbMaxWidth : '180px',
            thumbMaxHeight: '180px',
            locale: 'nl',
            removeIPA: true,
            descriptionLinks: true,
            redirect: true,
            elements: {
                loader : '<div class="ajaxLoading col-lg-12 col-md-12 col-sm-12 col-xs-12">Loading...</div>',
                title : ['<div class="wikipediaTitle">', '</div>'],
                description : ['<div class="wikipediaDescription col-lg-10 col-md-10 col-sm-10 col-xs-10">', '</div>'],
                logo : ['<div class="wikipediaLogo col-lg-2 col-md-2 col-sm-2 col-xs-2">', '</div>'],
                gallery: {
                    parent: ['<ul class="wikipediaThumbGallery">', '</ul>'],
                    child: ['<li class="wikipediaThumbnail">', '</li>'],
                }
            }
        },
        article: {
            logo: false,
            gallery:[],
            info:[]
        }
    };

    Wikipedia = {
        strRemove: function(theTarget, theString) {
            return $("<div/>").append(
                $(theTarget, theString).remove().end()
            ).html();
        },
        Get: function(wikipediaPage, options, callback){
            //check if pagetitle is set
            if(wikipediaPage == undefined) {
                console.log('Kein Wikipedia Suchtitel!Keine Abfrage gestartet!');
                return;
            }
            if(options != undefined) {
                //we got more options
                $.extend(Wiki.settings, options);
            }
            Wiki.article =  {
                gallery:[],
                info:[]
            };
            
            $.getJSON('http://'+Wiki.settings.locale+'.wikipedia.org/w/api.php?action=parse&format=json&callback=?', {page:wikipediaPage, prop:'text|images', uselang: Wiki.settings.locale}, function(parsedata) {
                //-- check if response returns error
                if (typeof parsedata.error !== "undefined") {
                    Wiki.article.title = parsedata.error.code
                    Wiki.article.description = parsedata.error.info;
                } else {
                    var data = $(parsedata.parse.text["*"]).wrap('<div></div>').parent();
                    //-- is this a rediredct page?
                    if (parsedata.parse.text["*"].substring(0, 3) == '<p>' || parsedata.parse.text["*"].substring(0, 25) == '<div class="redirectMsg">') {
                        //-- is there only 1 redirection?
                        if ($(data).find('ul').first().find('li').length == 1 && Wiki.settings.redirect) {
                            var wikipediaPage = $(data).find('a').first().attr('href');
                            //-- extract page from link
                            if (parsedata.parse.text["*"].substring(0, 25) == '<div class="redirectMsg">') {
                                wikipediaPage = wikipediaPage.split('title=');
                                wikipediaPage = wikipediaPage[wikipediaPage.length - 1].split('&');
                                wikipediaPage = wikipediaPage[0];
                            } else {
                                wikipediaPage = wikipediaPage.split('/');
                                wikipediaPage = wikipediaPage[wikipediaPage.length - 1];
                            }
                            Wikipedia.Get(wikipediaPage, options, callback);
                            callback = null; //-- prevent callback from firing twice
                        }

                        Wiki.article.description = Wikipedia.strRemove("sup", $(data).find('p').first()) + "<br>" + Wikipedia.strRemove("sup", $(data).find('ul').first());

                    } else {
                        Wiki.article.title = $(data).find('.infobox tr:first-child th').text();
                        if (typeof $(data).find('.infobox .image img').attr('src') !== "undefined") {
                            Wiki.article.logo = 'http:' + $(data).find('.infobox .image img').attr('src');
                        } else {
                            Wiki.article.logo = false;
                        }
                        Wiki.article.ipa = $(data).find('.IPA').text();
                        Wiki.article.description = $(data).find('p').first();
                        //-- remove superscript text
                        Wiki.article.description = Wikipedia.strRemove("sup", Wiki.article.description);
                        if (Wiki.settings.removeIPA) {
                            Wiki.article.description = Wikipedia.strRemove(".IPA", Wiki.article.description);
                            Wiki.article.description = Wiki.article.description.replace('[]', '');
                        }
                        if (!Wiki.settings.descriptionLinks) {
                            Wiki.article.description = $(Wiki.article.description).text();
                        }
                        $.each(data.find('.thumb a.image img'), function (index, image) {
                            Wiki.article.gallery.push('http:' + $(image).attr('src'))
                        });

                        $.each($(data).find('table.infobox tr'), function (index, element) {
                            if ($(element).has('td')) {
                                Wiki.article.info.push({
                                    name: $(element).find('th').text(),
                                    info: $(element).find('td').text()
                                });
                            }
                        });
                    }
                }

                if (typeof callback == 'function') { // make sure the callback is a function
                    callback.call(this); // brings the scope to the callback
                } else {
                    return Wiki.article;
                }
            });
        }
    };

    $.fn.Wikipedia = function(wikipediaPage, options){
        var wikiContainer = this;
        wikiContainer.html('');
        wikiContainer.append(Wiki.settings.elements.loader);
        if (typeof options.locale !== "undefined" &&  options.locale.indexOf('_') > -1) {
            options.locale = options.locale.substr(0, options.locale.length - (options.locale.indexOf('_')+1));
        }
        Wikipedia.Get(wikipediaPage, options, function(){
            wikiContainer.html('');
            if (Wiki.settings.showTitle) {
                wikiContainer.append(Wiki.settings.elements.title[0]+Wiki.article.title+Wiki.settings.elements.title[1]);
            }

            wikiContainer.append(Wiki.settings.elements.description[0]+Wiki.article.description+Wiki.settings.elements.description[1]);
            if (Wiki.settings.descriptionLinks) {
                $.each($(wikiContainer).find('.wikipediaDescription a'), function(index, element) {
                    var href = $(element).attr('href');
                    console.log(element);
                    if(href.indexOf("#") >= 0){
                        //-- remove anchor
                        $(element).parent('li').remove();
                    } else {
                        //-- is the link like index.php?title=
                        if (href.indexOf("php") >= 0){
                            //-- check if page exist
                            if ($(element).hasClass('new')){
                                $(element).replaceWith($(element).text());
                            } else {
                                href = href.split('title=');
                                href = href[href.length-1].split('&');
                                href = href[0];
                            }
                        } else {
                            href = href.split('/');
                            href = href[href.length-1];
                        }
                        if (href) {
                            href = 'javascript:$(\''+wikiContainer.selector+'\').Wikipedia(\''+href+'\');';
                            $(element).attr('href', href);
                        }
                    }

                });
            }

            if (Wiki.article.logo && Wiki.article.logo) {
                wikiContainer.append(Wiki.settings.elements.logo[0]+'<img src="'+Wiki.article.logo+'">'+Wiki.settings.elements.logo[1]);
            }

            if (Wiki.settings.maxThumbnails > 0 && Wiki.article.gallery.length > 0) {
                var data = '';
                $.each(Wiki.article.gallery, function(index, image){
                    data += Wiki.settings.elements.gallery.child[0]+'<img alt="" src="'+image+'">'+ Wiki.settings.elements.gallery.child[1];
                    if ((index+1) >= Wiki.settings.maxThumbnails) {
                        return false;
                    }
                });
                $(data).find('img').css({'width': 'auto', 'height': 'auto', 'max-width': Wiki.settings.thumbMaxWidth, 'max-height': Wiki.settings.thumbMaxHeight}).wrap('<li class="wikipediaThumbnail"></li>')
                wikiContainer.append(Wiki.settings.elements.gallery.parent[0]+data+Wiki.settings.elements.gallery.parent[1]);
            }
        });
    }


})(jQuery);
