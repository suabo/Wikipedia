jQuery Plugin for Wikipedia
===========================

## Description
          
jQuery Plugin zum einfachen nachladen von Daten aus Wikipedia über die Wikipedia API mittels JSON.
Zum laden muss ein Wikipediaseitentitel übergeben werden. Über den zweiten Parameter können
diverse Einstellungen für die Darstellung getroffen werden.

[Demo]http://support.suabo.de/opensource/jquery-plugin-wikipedia
          
## Usage

1- Include the Javascript resources into you pages <head>

     <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
     <script type="text/javascript" src="js/jquery.wikipedia.js"></script>

2- Add a placeholder for the widget to your page

    <div id="divRss"></div>

3- Add the Javascript that will populate the placeholder
     
    $('#ContainerToLoad').WikipediaWidget('Page Title', [{ 'showTitle': true, 
                                                           'maxThumbnails': 3, 
                                                           'cutFirstInfoTableRows': 4, 
                                                           'maxInfoTableRows': 8, 
                                                           'thumbMaxWidth': '180px', 
                                                           'thumbMaxHeight': '180px' 
                                                        }]);          

## Options

- **showTitle**
    Show or hide titlebar. Default: true

- **maxThumbnails**
    Set max count of thumbnails to load. Default: 3

- **cutFirstInfoTableRows**
    Cut out the first rows of the information table. Default: 4

- **maxInfoTableRows**
    Set max count of information table rows. Default: 8

- **thumbMaxWidth**
    Set max Thumbnail width. Default: '180px'

- **thumbMaxHeight**
    Set max Thumbnail height. Default: '180px'

## Demo

[Demo]http://support.suabo.de/opensource/jquery-plugin-wikipedia