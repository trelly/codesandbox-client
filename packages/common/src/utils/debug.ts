declare var __DEV__: boolean | undefined;

const getDebugger = () => {
  if (
    typeof document !== 'undefined' &&
    ((typeof __DEV__ === 'undefined' ||
      !__DEV__ ||
      process.env.NODE_ENV === 'production') &&
      document.location.search.indexOf('debug') === -1)
  ) {
    const global = window as any;
    // Return a debugger that will log to sentry
    return (key: string) => (message: string) => {
      if (typeof global.Raven === 'object') {
        try {
          global.Raven.captureBreadcrumb({
            message: `${key} - ${message}`,
            category: 'logging',
          });
        } catch (e) {
          console.error(e);
        }
      }
    };
  }

  // @ts-ignore
  const debug = require('debug'); // eslint-disable-line global-require
  debug.enable('cs:*');
  return debug;
};

export default getDebugger();
