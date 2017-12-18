import { Extract } from "../src/extract";
import { ExtractError } from "../src/extractError";
import { IpaContent }  from "../src/contentIPA";

import mocha = require('mocha');
import Sinon = require('sinon');
import uuid = require('uuid');
import util = require('util');
import td = require('testdouble');
import should = require('should');
import fs = require('fs');


describe("#extractor", () => {
    describe("#run", () => {
        context('when function is called without a filepath', () => {
            it("should throw error", () => {
                Extract.run(null).should.be.rejected();
            });
        });
        context('when function is called with an non-existant filePath', () => {
            it("should throw error", () => {
                Extract.run("./packages/fake.ipa").should.be.rejected();
            });
        });
        context('when function is called with IPA package', () => {
            it("should extract filename and fingerprint", async () => {
                let appContent = await Extract.run("./packages/adhoc-signed.ipa");
                should(appContent.originalFileName).eql("adhoc-signed.ipa");
                should(appContent.fingerprint).eql("5925b4532a1160dd89f3e01326be0069");
                should(appContent.displayName).eql("SoEntitled");
                should(appContent.uniqueIdentifier).eql("com.microsoft.SoEntitled");
                should(appContent.version).eql("1.0");
                should(appContent.buildVersion).eql("1");
                should(appContent.executableName).eql("SoEntitled");
                should(appContent.minimumOsVersion).eql("10.0");
                should(appContent.deviceFamily).eql("iOS");
            });
        });
        context('when function is called with IPA package 2', () => {
            it("should extract filename and fingerprint", async () => {
                let appContent = await Extract.run("./packages/net.hockeyapp.iostraining.ipa");
                should(appContent.originalFileName).eql("net.hockeyapp.iostraining.ipa");
                should(appContent.fingerprint).eql("c7314bbcd60ed4d4af3524c8d28ea56e");
                should(appContent.displayName).eql("App Insights");
                should(appContent.uniqueIdentifier).eql("Microsoft.ApplicationInsights");
                should(appContent.version).eql("1.0");
                should(appContent.buildVersion).eql("10");
                should(appContent.executableName).eql("ApplicationInsights");
                should(appContent.minimumOsVersion).eql("8.0");
                should(appContent.deviceFamily).eql("iOS");
            });
        });
        context('when function is called with IPA package 3', () => {
            it("should extract filename and fingerprint", async () => {
                let appContent = await Extract.run("./packages/valid_adhoc.ipa");
                should(appContent.originalFileName).eql("valid_adhoc.ipa");
                should(appContent.fingerprint).eql("38cb551e3f5af1a8aeca424faf5f4834");
                should(appContent.displayName).eql("Test");
                should(appContent.uniqueIdentifier).eql("de.codenauts.icebird.lite.beta");
                should(appContent.version).eql("1.0");
                should(appContent.buildVersion).eql("1");
                should(appContent.iconName).eql("Default-568h@2x.png");
            });
        });
        context('when function is called with zip package', () => {
            it("should extract filename and fingerprint", async () => {
                let appContent = await Extract.run("./packages/UwpApp_1.zip");
                should(appContent.originalFileName).eql("UwpApp_1.zip");
                should(appContent.fingerprint).eql("2bbf5b4813092ae3c365365a2508d870");
                should(appContent.icon).not.eql(undefined);
                should(appContent.iconName).eql("smalltile.scale-400.png");
                should(appContent.iconAppx).eql("UwpApp_1.1.2.0_scale-400.appx");
                should(appContent.uniqueIdentifier).eql("7b8e5825-5039-4f80-b71f-ac8f578f434e");
                should(appContent.buildVersion).eql("1.1.2.0");
                should(appContent.deviceFamily).eql("Windows");
            });
        });
        context('when function is called with appxbundle package', () => {
            it("should extract filename and fingerprint", async () => {
                let appContent = await Extract.run("./packages/Calculator.appxbundle");
                should(appContent.originalFileName).eql("Calculator.appxbundle");
                should(appContent.fingerprint).eql("c8a8d1c83e586bb1f22fbaee470fe71f");
                should(appContent.uniqueIdentifier).eql("61908RichardWalters.Calculator");
                should(appContent.languages.length).eql(12);
                should(appContent.languages).eql(["de", "es", "fr", "hu", "it", "nl", "pl", "pt", "ru", "tr", "uk", "zh-hans"]);
                should(appContent.buildVersion).eql("2016.1003.2115.0");
                should(appContent.deviceFamily).eql("Windows");
            });
        });
        context('when function is called with an unhandled package type', () => {
            it("should throw error", () => {
                Extract.run("./packages/fake.weird").should.be.rejected();
            });
        });
    });
});

