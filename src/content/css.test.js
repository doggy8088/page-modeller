/* eslint-disable no-underscore-dangle */
import css from './css';

describe('uniqueCss', () => {
  const uniqueCss = css.__get__('uniqueCss');
  test('css selector unchanged for single matching element', () => {
    document.body.innerHTML = `<input id="test" />`;
    const element = document.getElementById('test');
    const cssSelector = `input[id='test']`;
    expect(uniqueCss(element, cssSelector)).toBe(cssSelector);
  });

  test('nth-of-type index appended to selector path for multiple matching elements', () => {
    document.body.innerHTML = `<p>One</p><p>Two</p>`;
    const els = document.querySelectorAll('p');
    const p1 = els[0];
    const p2 = els[1];
    expect(uniqueCss(p1, 'p')).toBe('p:nth-of-type(1)');
    expect(uniqueCss(p2, 'p')).toBe('p:nth-of-type(2)');
  });
});

describe('idBuilder', () => {
  const idBuilder = css.__get__('idBuilder');

  test('element without id returns false', () => {
    document.body.innerHTML = '<p>Paragraph</p>';
    const element = document.querySelector('p');
    expect(idBuilder(element)).toBe(false);
  });

  test('css selector for element with id', () => {
    document.body.innerHTML = '<input id="forename" />';
    const element = document.getElementById('forename');
    expect(idBuilder(element)).toBe(`input[id='forename']`);
  });

  test('css selector for multiple elements with duplicate id', () => {
    document.body.innerHTML = '<input id="surname" /><input id="surname" class="second" />';
    const element1 = document.getElementById('surname');
    const element2 = document.getElementsByClassName('second')[0];
    expect(idBuilder(element1)).toBe(`input[id='surname']:nth-of-type(1)`);
    expect(idBuilder(element2)).toBe(`input[id='surname']:nth-of-type(2)`);
  });
});

describe('nameBuilder', () => {
  const nameBuilder = css.__get__('nameBuilder');

  test('element without name returns false', () => {
    document.body.innerHTML = '<p>Paragraph</p>';
    const element = document.querySelector('p');
    expect(nameBuilder(element)).toBe(false);
  });

  test('css selector for element with name', () => {
    document.body.innerHTML = '<input name="forename" />';
    const element = document.getElementsByName('forename')[0];
    expect(nameBuilder(element)).toBe(`input[name='forename']`);
  });

  test('css selector for multiple elements with duplicate name', () => {
    document.body.innerHTML = '<input name="surname" /><input name="surname" class="second" />';
    const element1 = document.getElementsByName('surname')[0];
    const element2 = document.getElementsByClassName('second')[0];
    expect(nameBuilder(element1)).toBe(`input[name='surname']:nth-of-type(1)`);
    expect(nameBuilder(element2)).toBe(`input[name='surname']:nth-of-type(2)`);
  });
});

describe('ariaLabelBuilder', () => {
  const ariaLabelBuilder = css.__get__('ariaLabelBuilder');

  test('element without aria-label returns false', () => {
    document.body.innerHTML = '<p>Paragraph</p>';
    const element = document.querySelector('p');
    expect(ariaLabelBuilder(element)).toBe(false);
  });

  test('css selector for element with aria-label', () => {
    document.body.innerHTML = '<input aria-label="The Forename" />';
    const element = document.querySelector(`input`);
    expect(ariaLabelBuilder(element)).toBe(`input[aria-label='The Forename']`);
  });

  test('css selector for multiple elements with duplicate name', () => {
    document.body.innerHTML = '<input aria-label="Something" /><input aria-label="Something" class="second" />';
    const element1 = document.querySelector(`input`);
    const element2 = document.getElementsByClassName('second')[0];
    expect(ariaLabelBuilder(element1)).toBe(`input[aria-label='Something']:nth-of-type(1)`);
    expect(ariaLabelBuilder(element2)).toBe(`input[aria-label='Something']:nth-of-type(2)`);
  });
});

describe('linkHrefBuilder', () => {
  const linkHrefBuilder = css.__get__('linkHrefBuilder');

  test('non A element returns false', () => {
    document.body.innerHTML = '<p>Paragraph</p>';
    const element = document.querySelector('p');
    expect(linkHrefBuilder(element)).toBe(false);
  });

  test('A element without href attribute returns false', () => {
    document.body.innerHTML = '<a>One></a>';
    const element = document.querySelector('a');
    expect(linkHrefBuilder(element)).toBe(false);
  });

  test('A element with relative href attribute returns correct css locator', () => {
    document.body.innerHTML = '<a href="section/page.html"/>';
    const element = document.querySelector(`a`);
    expect(linkHrefBuilder(element)).toBe(`a[href*='section/page.html']`);
  });

  test('A element with absolute href attribute returns correct css locator', () => {
    document.body.innerHTML = '<a href="https://photos.google.com/images/kittens.html"/>';
    const element = document.querySelector(`a`);
    expect(linkHrefBuilder(element)).toBe(`a[href*='images/kittens.html']`);
  });

  test('css selector for multiple elements with matching href attribute', () => {
    document.body.innerHTML = '<a href="contact.html"/>Contact<a href="contact.html" class="second"/>';
    const element1 = document.querySelector(`a`);
    const element2 = document.getElementsByClassName('second')[0];
    expect(linkHrefBuilder(element1)).toBe(`a[href*='contact.html']:nth-of-type(1)`);
    expect(linkHrefBuilder(element2)).toBe(`a[href*='contact.html']:nth-of-type(2)`);
  });
});

describe('imageBuilder', () => {
  const imageBuilder = css.__get__('imageBuilder');

  test('non IMG element returns false', () => {
    document.body.innerHTML = '<p>Paragraph</p>';
    const element = document.querySelector('p');
    expect(imageBuilder(element)).toBe(false);
  });

  test('IMG element without alt, title or src returns false', () => {
    document.body.innerHTML = '<img class="dummy" />';
    const element = document.querySelector('img');
    expect(imageBuilder(element)).toBe(false);
  });

  test('IMG element with alt attribute returns correct css selector', () => {
    document.body.innerHTML = '<img alt="Test"/>';
    const element = document.querySelector(`img`);
    expect(imageBuilder(element)).toBe(`img[alt='Test']`);
  });

  test('css selector for multiple elements with matching alt attribute', () => {
    document.body.innerHTML = '<img alt="Test"/><img alt="Test" class="second"/>';
    const element1 = document.querySelector(`img`);
    const element2 = document.getElementsByClassName('second')[0];
    expect(imageBuilder(element1)).toBe(`img[alt='Test']:nth-of-type(1)`);
    expect(imageBuilder(element2)).toBe(`img[alt='Test']:nth-of-type(2)`);
  });

  test('IMG element with title attribute returns correct css selector', () => {
    document.body.innerHTML = '<img title="Profile"/>';
    const element = document.querySelector(`img`);
    expect(imageBuilder(element)).toBe(`img[title='Profile']`);
  });

  test('css selector for multiple elements with matching title attribute', () => {
    document.body.innerHTML = '<img title="Test"/><img title="Test" class="second"/>';
    const element1 = document.querySelector(`img`);
    const element2 = document.getElementsByClassName('second')[0];
    expect(imageBuilder(element1)).toBe(`img[title='Test']:nth-of-type(1)`);
    expect(imageBuilder(element2)).toBe(`img[title='Test']:nth-of-type(2)`);
  });

  test('IMG element with relative src attribute returns correct css selector', () => {
    document.body.innerHTML = '<img src="images/kittens.png"/>';
    const element = document.querySelector(`img`);
    expect(imageBuilder(element)).toBe(`img[src*='images/kittens.png']`);
  });

  test('IMG element with absolute src attribute returns correct css selector', () => {
    document.body.innerHTML = '<img src="https://photos.google.com/images/kittens.png"/>';
    const element = document.querySelector(`img`);
    expect(imageBuilder(element)).toBe(`img[src*='images/kittens.png']`);
  });

  test('css selector for multiple elements with matching src attribute', () => {
    document.body.innerHTML = '<img src="puppy.png"/><img src="puppy.png" class="second"/>';
    const element1 = document.querySelector(`img`);
    const element2 = document.getElementsByClassName('second')[0];
    expect(imageBuilder(element1)).toBe(`img[src*='puppy.png']:nth-of-type(1)`);
    expect(imageBuilder(element2)).toBe(`img[src*='puppy.png']:nth-of-type(2)`);
  });
});

describe('relativeCssBuilder', () => {
  const relativeCssBuilder = css.__get__('relativeCssBuilder');

  test('null element returns false', () => {
    document.body.innerHTML = '<p>Paragraph</p>';
    expect(relativeCssBuilder(null)).toBe(false);
  });

  test('unmatched element returns false', () => {
    document.body.innerHTML = '<p>Paragraph</p>';
    const element = document.querySelector('p');
    expect(relativeCssBuilder(element)).toBe(false);
  });

  test('parent element with id returns correct css selector', () => {
    document.body.innerHTML = '<div id="parent"><p>Paragraph</p></div>';
    const element = document.querySelector('p');
    expect(relativeCssBuilder(element)).toBe(`div[id='parent'] > p`);
  });

  test('ancestor element with id returns correct css selector', () => {
    document.body.innerHTML = '<div id="ancestor"><div><p>Paragraph</p></div></div>';
    const element = document.querySelector('p');
    expect(relativeCssBuilder(element)).toBe(`div[id='ancestor'] > div > p`);
  });

  test('ancestor element with multiple children returns correct css selector', () => {
    document.body.innerHTML = '<div id="ancestor"><div><span>Span</span></div><div><p>Paragraph</p></div></div>';
    const element = document.querySelector('p');
    expect(relativeCssBuilder(element)).toBe(`div[id='ancestor'] > div:nth-of-type(2) > p`);
  });

  test('relative locator from parent with multiple siblings returns correct css selector', () => {
    document.body.innerHTML = '<div id="parent"><p>Paragraph</p><p class="second">Paragraph</p></div>';
    const element1 = document.querySelector('p');
    const element2 = document.querySelector('p.second');
    expect(relativeCssBuilder(element1)).toBe(`div[id='parent'] > p:nth-of-type(1)`);
    expect(relativeCssBuilder(element2)).toBe(`div[id='parent'] > p:nth-of-type(2)`);
  });
});

describe('getCssSelector', () => {
  const getCssSelector = css.__get__('getCssSelector');

  test('element which matches preferred selector', () => {
    document.body.innerHTML = '<a id="contact-link">Contact</a>';
    const element = document.querySelector('a');
    expect(getCssSelector(element)).toBe(`a[id='contact-link']`);
  });

  test('element which matches relative selector', () => {
    document.body.innerHTML = '<div id="parent"><p>Paragraph</p></div>';
    const element = document.querySelector('p');
    expect(getCssSelector(element)).toBe(`div[id='parent'] > p`);
  });

  test('element which matches fallback selector', () => {
    document.body.innerHTML = '<div><p>Paragraph</p></div>';
    const element = document.querySelector('p');
    expect(getCssSelector(element)).toBe('P');
  });
});
