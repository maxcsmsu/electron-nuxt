import test from 'ava';

import {beforeEach, afterEachAlways} from "../helpers";


test.beforeEach(beforeEach);
test.afterEach.always(afterEachAlways);


test('launch', async t => {
    const app = t.context.app;
    await app.client.waitUntilWindowLoaded();

    const win = app.browserWindow;
    // Please note that getWindowCount() will return 2 if `dev tools` are opened.
    t.is(await app.client.getWindowCount(), 1);
    t.false(await win.isMinimized());

    const {width, height} = await win.getBounds();
    t.true(width > 0);
    t.true(height > 0);
});

test('should initialize nuxt app', async t => {
    const app = t.context.app;

    try{
        await app.client.nuxt.ready();
        t.pass();
    }catch (e) {
        t.fail(e.message);
    }
})

test('should load file content from resources directory', async t => {
    const app = t.context.app;

    try{
        await app.client.nuxt.ready();
        await app.client.waitUntilTextExists('#external-resource', 'EXTERNAL_FILE_CONTENT', 5000);
        t.pass();
    }catch (e) {
        t.fail(e.message);
    }

});


test('built app should not throw any error', async t => {
    const app = t.context.app;
    await app.client.nuxt.ready();
    const rendererLogs = await app.client.getRenderProcessLogs();

    const rendererErrors = rendererLogs.filter(log => log.level === 'ERROR');
    if(rendererErrors.length > 0) rendererErrors.forEach(log => t.log(log.message));

    t.is(rendererErrors.length, 0);
})
