# Snippets

## videos

```html
<div class="video">
  Paste the embed code from youtube, vimeo, … here
</div>
```

This makes your videos responsive, so they will always fit on the screen (even on tiny mobile screens).

## picture frame around images and videos

```html
<div class="pictureframe">
  <img … >
</div>
```

```html
<div class="pictureframe">
  <div class="video">
    …
  </div>
</div>

## content in purple box

To get a purple background (e.g. for the heading above the form), put its content in a div like this:

```html
<div class="box">
  <h2>Heading</h2>
</div>
```

## background info

* the class `.info-toggle` on the element enables the "show more info" logic
* a click on the toggle shows the element with the id `#background-info` and
  hides the toggle
* the class `.background-info-hidden` on the more info container sets the
  container to be hidden on page load (this is done that way to show the
  background info in case JS is disabled)

```html
<a class="info-toggle">More info</a>

<div id="background-info" class="background-info-hidden">
  <h2>Background info</h2>
  <p>more more more info</p>
</div>
```

## share links

```html
<ul class="share-links">
  <li class="facebook"><a class="button" href="https://www.facebook.com/sharer.php?u={{urlencoded url}}" title="Share this via Facebook!" target="_blank" data-share="facebook"><span>Facebook</span></a></li>
  <li class="twitter"><a class="button" href="http://twitter.com/share?text={{urlencoded share text}}&url={{urlencoded url}}" title="Share this via Twitter!" target="_blank" data-share="twitter"><span>Twitter</span></a></li>
  <li class="email last"><a class="button" href="{{EN email share url}}" title="Share this via E-Mail!" target="_blank" data-share="email"><span>E-Mail</span></a></li>
</ul>
```

Don't forget to replace the {{placeholder text}} with the right links!

## submission tracking

Place this snippet on the thankyou page:

```html
<input type="hidden" name="track-submission" value="1">
```
