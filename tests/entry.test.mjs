import test from 'node:test';
import assert from 'node:assert/strict';
import { getDoor } from '../src/lib/entry.js';

function browser(t, { hash = '', search = '', saved, blocked = false } = {}) {
    const values = new Map(saved ? [['guestDoor', saved]] : []);
    const oldWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
    const oldStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
    Object.defineProperty(globalThis, 'window', { configurable: true, value: { location: { hash, search } } });
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
        getItem(key) { if (blocked) throw new Error('blocked'); return values.get(key) ?? null; },
        setItem(key, value) { if (blocked) throw new Error('blocked'); values.set(key, value); },
        removeItem(key) { if (blocked) throw new Error('blocked'); values.delete(key); },
    } });
    t.after(() => {
        if (oldWindow) Object.defineProperty(globalThis, 'window', oldWindow);
        else delete globalThis.window;
        if (oldStorage) Object.defineProperty(globalThis, 'localStorage', oldStorage);
        else delete globalThis.localStorage;
    });
    return values;
}

test('printed QR fragments remember all six QR locations between pages', t => {
    const values = browser(t);
    for (const entry of ['1', '2', '3', '4', '5', '6']) {
        window.location.hash = `#k=fake-test-key&d=${entry}`;
        assert.equal(getDoor(), entry);
        assert.equal(values.get('guestDoor'), entry);
        window.location.hash = '';
        assert.equal(getDoor(), entry);
    }
});

test('a new query link replaces the previous scanned entry', t => {
    browser(t, { search: '?table=34&d=4', saved: '1' });
    assert.equal(getDoor(), '4');
    window.location.search = '';
    assert.equal(getDoor(), '4');
});

test('the printed QR fragment takes priority over query and saved entries', t => {
    browser(t, { hash: '#k=fake-test-key&d=2', search: '?d=3', saved: '1' });
    assert.equal(getDoor(), '2');
});

test('invalid or missing entries never silently route from a stale or invented door', t => {
    const values = browser(t, { saved: '2' });
    for (const value of ['', '0', '7', '01', 'NaN', 'constructor', '__proto__']) {
        window.location.hash = `#d=${value}`;
        assert.equal(getDoor(), null);
        assert.equal(values.has('guestDoor'), false);
    }
    window.location.hash = '';
    assert.equal(getDoor(), null);
    values.set('guestDoor', 'invalid');
    assert.equal(getDoor(), null);
});

test('QR links still identify the entry when browser storage is blocked', t => {
    browser(t, { hash: '#k=fake-test-key&d=3', blocked: true });
    assert.equal(getDoor(), '3');
    window.location.hash = '';
    window.location.search = '?d=6';
    assert.equal(getDoor(), '6');
    window.location.search = '';
    assert.equal(getDoor(), null);
});
