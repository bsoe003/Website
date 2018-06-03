/* tslint:disable:no-any */

interface Window {
  GoogleAnalyticsObject: any;
  ga: any;
}

class Analytics {
  private static readonly SCRIPT_TAG_NAME = 'script';

  public static start() {
    Analytics.setup(window);
  }

  private static setup(_window: any) {
    _window.GoogleAnalyticsObject = 'ga';
    // prettier-ignore
    _window.ga = _window.ga || ((...args) => {
      (_window.ga.q = _window.ga.q || []).push(...args);
    });
    _window.ga.l = new Date().getTime();
    const script = document.createElement(Analytics.SCRIPT_TAG_NAME);
    const body = document.getElementsByTagName('body')[0];
    script.async = true;
    script.src = 'https://www.google-analytics.com/analytics.js';
    // prettier-ignore
    body.insertBefore(script, document.getElementsByTagName(Analytics.SCRIPT_TAG_NAME)[0]);
    _window.ga('create', 'UA-82807303-1', 'auto');
    _window.ga('send', 'pageview');
  }
}

export default Analytics;
