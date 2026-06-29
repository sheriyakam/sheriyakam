import { Platform } from 'react-native';

if (typeof window === 'undefined') {
    const noop = () => {};
    const mockStorage = {
        getItem: () => Promise.resolve(null),
        setItem: () => Promise.resolve(),
        removeItem: () => Promise.resolve(),
        clear: () => Promise.resolve(),
        key: () => null,
        length: 0,
    };

    const mockWindow = {
        location: {
            href: 'http://localhost',
            pathname: '/',
            search: '',
            hash: '',
            hostname: 'localhost',
            protocol: 'http:',
            origin: 'http://localhost',
        },
        document: {
            createElement: () => ({ style: {} }),
            getElementById: () => null,
            getElementsByTagName: () => [],
        },
        localStorage: mockStorage,
        sessionStorage: mockStorage,
        addEventListener: noop,
        removeEventListener: noop,
        alert: noop,
        confirm: () => false,
        prompt: () => null,
        navigator: {
            userAgent: '',
            geolocation: {
                getCurrentPosition: noop,
                watchPosition: noop,
                clearWatch: noop,
            },
        },
        setTimeout,
        clearTimeout,
        setInterval,
        clearInterval,
    };

    // Safe assignment function using Object.defineProperty
    const defineGlobal = (name, value) => {
        try {
            Object.defineProperty(global, name, {
                value,
                writable: true,
                configurable: true,
            });
        } catch (e) {
            // If redefinition fails, try direct assignment
            try {
                global[name] = value;
            } catch (err) {
                // If direct assignment also fails, modify properties in place if object exists
                const existing = global[name];
                if (existing && typeof existing === 'object') {
                    for (const key in value) {
                        try {
                            Object.defineProperty(existing, key, {
                                value: value[key],
                                writable: true,
                                configurable: true,
                            });
                        } catch (propErr) {
                            existing[key] = value[key];
                        }
                    }
                }
            }
        }
    };

    defineGlobal('window', mockWindow);
    defineGlobal('document', mockWindow.document);
    defineGlobal('localStorage', mockWindow.localStorage);
    defineGlobal('sessionStorage', mockWindow.sessionStorage);
    defineGlobal('location', mockWindow.location);
    defineGlobal('navigator', mockWindow.navigator);
}
