import { logger, Log, LogLevel } from "../commom/Logger";
import { getCLS, getFID, getFCP, getLCP, getTTFB, Metric } from 'web-vitals'


const logLevelColor = {
    good: '#a9ef8f',
    average: '#f7b190',
    poor: '#f3526e',
};

const valueAppraise = {
    'largest-contentful-paint': [2500, 4000],
    'first-input': [100, 300],
    'layout-shift': [0.1, 0.25],
};

function supportedPerformanceObserver() {
    return 'PerformanceObserver' in window;
}

export class PerformanceLog {
    constructor() {
        this.init()
    }
    init() {
        if (!supportedPerformanceObserver()) return
        getCLS(this.report)
        getFID(this.report)
        getFCP(this.report)
        getLCP(this.report)
        getTTFB(this.report)
        this.subscribeToLongTasks()
    }
    report(metric: Metric) {
        logger.report(new Log({ value: metric.value, level: LogLevel.Info, name: metric.name }));
    }
    subscribeToLongTasks() {
        const observer = new PerformanceObserver(this.longTaskHandler)
        observer.observe({ entryTypes: ['longtask'] })
    }
    longTaskHandler(list: PerformanceObserverEntryList) {
        list.getEntries().forEach(function (entry) {
            logger.report(new Log({ value: entry.duration, level: LogLevel.Warn, name: 'longtask' }));
        })
    }
}
