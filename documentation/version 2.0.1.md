## Version 2.0.1

## Usage

1- Include the Javascript resources into you pages <head>

     <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
     <script type="text/javascript" src="js/jquery.wikipedia.2.0.1.js"></script>

2- Add a placeholder for the widget to your page

    <div id="divRss"></div>

3- Add the Javascript that will populate the placeholder
     
    $('#divRss').Wikipedia('Page Title', options, callback);          

## Options

- **showTitle**
    Show or hide titlebar. Default: `false`
- **showInfo**
    Show or hide info. Default: `true`
- **maxThumbnails**
    Set max count of thumbnails to load. Default: `0`
- **cutFirstInfoTableRows**
    Cut out the first rows of the information table. Default: `0`
- **maxInfoTableRows**
    Set max count of information table rows. 0 means all. Default: `0`
- **thumbMaxWidth**
    Set max Thumbnail width. Default: `'180px'`
- **thumbMaxHeight**
    Set max Thumbnail height. Default: `'180px'`
- **locale**
    Locale you want to request the information from. Default: `'en'`
- **removeIPA**
    Remove the "[ˈæpəlˌɪŋk]" IPA. Default: `true`
- **descriptionLinks**
    Show links in description. Default: `true`
- **redirect**
    Redirect when only 1 link is found. Default: `true`
- **elements.loader**
    Container the datavis placed in. Default: `'<div class="ajaxLoading">Loading...</div>'`
- **elements.title**
    Container the datavis placed in. Default: `['<div class="wikipediaTitle">', '</div>']`
- **elements.description**
    Container the datavis placed in. Default: `['<div class="wikipediaDescription">', '</div>']`
- **elements.logo**
    Container the datavis placed in. Default: `['<div class="wikipediaLogo">', '</div>']`
- **elements.gallery.parent**
    Container the datavis placed in. Default: `['<ul class="wikipediaThumbGallery">', '</ul>']`
- **elements.gallery.child**
    Container the datavis placed in. Default: `['<li class="wikipediaThumbnail">', '</li>']`

## Demo
Demo not yet available
