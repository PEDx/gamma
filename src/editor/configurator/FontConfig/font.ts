export interface Font {
    ch: string
    en: string
}
export const fontMap = {
    'windows': [
        {
            ch: '宋体',
            en: 'SimSun'
        },
        {
            ch: '黑体',
            en: 'SimHei'
        },
        {
            ch: '微软雅黑',
            en: 'Microsoft Yahei'
        },
        {
            ch: '微软正黑体',
            en: 'Microsoft JhengHei'
        },
        {
            ch: '楷体',
            en: 'KaiTi'
        },
        {
            ch: '新宋体',
            en: 'NSimSun'
        },
        {
            ch: '仿宋',
            en: 'FangSong'
        }],
    'OS X': [
        {
            ch: '苹方',
            en: 'PingFang SC'
        },
        {
            ch: '华文黑体',
            en: 'STHeiti'
        },
        {
            ch: '华文楷体',
            en: 'STKaiti'
        },
        {
            ch: '华文宋体',
            en: 'STSong'
        },
        {
            ch: '华文仿宋',
            en: 'STFangsong'
        },
        {
            ch: '华文中宋',
            en: 'STZhongsong'
        },
        {
            ch: '华文琥珀',
            en: 'STHupo'
        },
        {
            ch: '华文新魏',
            en: 'STXinwei'
        },
        {
            ch: '华文隶书',
            en: 'STLiti'
        },
        {
            ch: '华文行楷',
            en: 'STXingkai'
        },
        {
            ch: '冬青黑体简',
            en: 'Hiragino Sans GB'
        },
        {
            ch: '兰亭黑-简',
            en: 'Lantinghei SC'
        },
        {
            ch: '翩翩体-简',
            en: 'Hanzipen SC'
        },
        {
            ch: '手札体-简',
            en: 'Hannotate SC'
        },
        {
            ch: '宋体-简',
            en: 'Songti SC'
        },
        {
            ch: '娃娃体-简',
            en: 'Wawati SC'
        },
        {
            ch: '魏碑-简',
            en: 'Weibei SC'
        },
        {
            ch: '行楷-简',
            en: 'Xingkai SC'
        },
        {
            ch: '雅痞-简',
            en: 'Yapi SC'
        },
        {
            ch: '圆体-简',
            en: 'Yuanti SC'
        }],
    'open': [
        {
            ch: '思源黑体',
            en: 'Source Han Sans CN'
        },
        {
            ch: '思源宋体',
            en: 'Source Han Serif SC'
        },
        {
            ch: '文泉驿微米黑',
            en: 'WenQuanYi Micro Hei'
        }],
};


export const rootFontFamily = window.getComputedStyle(document.documentElement)['fontFamily']


export const _isSupportFontFamily = function (h: string) {
    const e = "a";
    const d = 100;
    const a = 100,
        i = 100;
    const c = document.createElement("canvas");
    const b = c.getContext("2d")!;
    c.width = a;
    c.height = i;
    b.textAlign = "center";
    b.fillStyle = "black";
    b.textBaseline = "middle";
    const g = function (j: string) {
        b.clearRect(0, 0, a, i);
        b.font = d + "px " + j + ", " + h;
        b.fillText(e, a / 2, i / 2);
        const k = b.getImageData(0, 0, a, i).data;
        return [].slice.call(k).filter(function (l) {
            return l !== 0
        });
    };
    return g
};

const defualtFont = "Arial";
const getName = _isSupportFontFamily(defualtFont)

export const isSupportFontFamily = (fontFamily: string) => {
    return new Promise<boolean>((resolve) => {
        if (typeof fontFamily !== "string") {
            return resolve(false)
        }
        if (fontFamily.toLowerCase() == defualtFont.toLowerCase()) {
            return resolve(true)
        }
        setTimeout(() => {
            const bol = getName(defualtFont).join("") !== getName(fontFamily).join("")
            resolve(bol)
        })
    })
}