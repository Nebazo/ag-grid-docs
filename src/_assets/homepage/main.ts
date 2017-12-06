import './main.scss';
import 'bootstrap';
import * as $ from 'jquery';
import * as lazyload from 'lazyload';
import * as AnchorJS from 'anchor-js';
import * as Prism from 'prismjs';
import { initCookieDisclaimer } from '../common/cookie-warning';
import 'prismjs/components/prism-bash';

function resetIndent(str) {
    const leadingWhitespace = str.match(/^\n?( +)/) ;
    if (leadingWhitespace) {
        return str.replace(new RegExp(' {' + leadingWhitespace[1].length + '}', 'g'), '').trim();
    } else {
        return str;
    }
}

$(() => {
    initCookieDisclaimer();

    var links = $('#nav-scenarios a');
    var demos = $('#stage-scenarios .demo');

    links.each(function(index) {
        $(this).click(function() {
            links.removeClass('active');
            $(this).addClass('active');

            demos.removeClass('current');
            $(demos[index]).addClass('current');

            demos[index].dispatchEvent(new CustomEvent('scenarios:show', {bubbles: false, cancelable: false}));

            return false;
        });
    });

    (<any> $('[data-toggle="popover"]')).popover();

    var anchors = new AnchorJS();
    anchors.options = {
        placement: 'right',
        visible: 'hover'
    };

    anchors.add('#stage-feature-highlights section h3, #stage-feature-highlights section h4');
    var nav = $('#stage-feature-highlights aside');

    var level = 3;
    var prevLink = null;
    var list = $('<ul></ul>');
    var breakpoints: { heading: any, link: any }[] = [];

    nav.append(list);

    anchors.elements.forEach(heading => {
        var $heading = $(heading);
        var headingLevel = parseInt(heading.tagName.slice(1));

        var enterprise = $heading
            .parent()
            .parent()
            .hasClass('enterprise');

        var link = $(`<li><a href=#${heading.id}>${$heading.text()} ${enterprise ? ' <span class="enterprise">e</span>' : ''}</a></li>`);

        if (headingLevel > level) {
            list = $('<ul></ul>');
            prevLink.append(list);
        } else if (headingLevel < level) {
            list = list.parent().parent();
        }

        list.append(link);
        prevLink = link;
        level = headingLevel;

        breakpoints.push({
            heading: $heading,
            link: link,
        });
    });

    new lazyload(document.querySelectorAll('#stage-feature-highlights img'), {});

    window.addEventListener('scroll', function(e) {
        var scrollBottom = $(window).scrollTop();
        var i = 0;

        while (i < breakpoints.length - 1 && breakpoints[i].heading.offset().top < scrollBottom) {
            i++;
        }

        nav.find('li').removeClass('current-feature');
        breakpoints[i].link.addClass('current-feature');
    });

    // code highlighting
    $('pre > code').each(function() { $(this).text(resetIndent($(this).text())); });
    Prism.highlightAll(false);
});