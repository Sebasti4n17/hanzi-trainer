import os
import requests

# Lista de palabras en chino y sus nombres de archivo
""" words = {
    "困": "kun.mp3",
    "不好意思": "buhaoyisi.mp3",
    "对不起": "duibuqi.mp3",
    "还可以": "hai_keyi.mp3",
    "挺好的": "ting_hao_de.mp3",
    "我很喜欢你！": "wo_hen_xihuan_ni.mp3",
    "她不喜欢我！": "ta_bu_xihuan_wo.mp3",
    "饿": "e.mp3",
    "渴": "ke.mp3",
    "爸爸": "baba.mp3",
    "妈妈": "mama.mp3",
    "哥哥": "gege.mp3",
    "弟弟": "didi.mp3",
    "姐姐": "jiejie.mp3",
    "妹妹": "meimei.mp3",
    "家": "jia.mp3",
    "您好": "ninhao.mp3",
    "你好": "nihao.mp3",
    "你叫什么名字？": "ni_jiao_shenme_mingzi.mp3",
    "你怎么样？": "ni_zenmeyang.mp3",
    "再见": "zaijian.mp3",
    "谢谢": "xiexie.mp3",
    "谢谢您": "xiexie_nin.mp3",
    "不客气": "bukeqi.mp3",
    "没关系": "mei_guanxi.mp3",
    "这是": "zhe_shi.mp3",
    "那是什么?": "na_shi_shenme.mp3",
    "这是什么？": "zhe_shi_shenme.mp3",
    "这个": "zhege.mp3",
    "那个": "nage.mp3",
    "一": "yi.mp3",
    "二": "er.mp3",
    "两": "liang.mp3",
    "三": "san.mp3",
    "四": "si.mp3",
    "五": "wu.mp3",
    "六": "liu.mp3",
    "七": "qi.mp3",
    "八": "ba.mp3",
    "九": "jiu.mp3",
    "十": "shi.mp3",
    "多少": "duoshao.mp3",
    "几": "ji.mp3",
    "吃": "chi.mp3",
    "吃饭": "chi_fan.mp3",
    "饭店": "fandian.mp3",
    "包子": "baozi.mp3",
    "饺子": "jiaozi.mp3",
    "炒饭": "chaofan.mp3",
    "炒面": "chaomian.mp3",
    "菜": "cai.mp3",
    "汉堡": "hanbao.mp3",
    "牛肉汉堡": "niurou_hanbao.mp3",
    "牛肉": "niurou.mp3",
    "肉": "rou.mp3",
    "蔬菜": "shucai.mp3",
    "汤": "tang.mp3",
    "面": "mian.mp3",
    "水": "shui.mp3",
    "咖啡": "kafei.mp3",
    "牛奶": "niunai.mp3",
    "果汁": "guozhi.mp3",
    "喝": "he.mp3",
    "好吃": "haochi.mp3",
    "好喝": "haohe.mp3",
    "东西": "dongxi.mp3",
    "书": "shu.mp3",
    "笔": "bi.mp3",
    "衣服": "yifu.mp3",
    "鞋": "xie.mp3",
    "杯": "bei.mp3",
    "瓶": "ping.mp3",
    "碗": "wan.mp3",
    "中国人": "zhongguo_ren.mp3",
    "这些中国人": "zhexie_zhongguoren.mp3",
    "美国人": "meiguo_ren.mp3",
    "这个美国人": "zhege_meiguoren.mp3",
    "法国人": "faguo_ren.mp3",
    "什么": "shenme.mp3",
    "是": "shi.mp3",
    "不是": "bu_shi.mp3",
    "不对": "bu_dui.mp3",
    "对": "dui.mp3",
    "有没有？": "you_meiyou.mp3",
    "有": "you.mp3",
    "没有": "meiyou.mp3",
    "这个是什么？": "zhege_shi_shenme.mp3",
    "买": "mai.mp3",
    "去": "qu.mp3",
    "想": "xiang.mp3",
    "喜欢": "xihuan.mp3",
    "要": "yao.mp3",
    "不要": "bu_yao.mp3",
    "和": "he.mp3",
    "还是": "haishi.mp3",
    "那...": "na.mp3",
    "那些": "naxie.mp3",
    "一些": "yixie.mp3",
    "我的朋友": "wode_pengyou.mp3",
    "我们": "women.mp3",
    "我们要这个": "women_yao_zhege.mp3"
} """

words = {
'困':'困.mp3',
'不好意思':'不好意思.mp3',
'对不起':'对不起.mp3',
'还可以':'还可以.mp3',
'挺好的':'挺好的.mp3',
'我很喜欢你':'我很喜欢你.mp3',
'她不喜欢我':'她不喜欢我.mp3',
'饿':'饿.mp3',
'渴':'渴.mp3',



'爸爸':'爸爸.mp3',
'妈妈':'妈妈.mp3',
'哥哥':'哥哥.mp3',
'弟弟':'弟弟.mp3',
'姐姐':'姐姐.mp3',
'妹妹':'妹妹.mp3',
'家':'家.mp3',



'您好':'您好.mp3',
'你好':'你好.mp3',
'你叫什么名字':'你叫什么名字.mp3',
'你怎么样':'你怎么样.mp3',
'再见':'再见.mp3',
'谢谢':'谢谢.mp3',
'谢谢您':'谢谢您.mp3',
'不客气':'不客气.mp3',
'没关系':'没关系.mp3',
'这是':'这是.mp3',
'那是什么?':'那是什么?.mp3',
'还可以':'还可以.mp3',
'这是什么':'这是什么.mp3',
'这个':'这个.mp3',
'那个':'那个.mp3',



'一':'一.mp3',
'二':'二.mp3',
'两':'两.mp3',
'三':'三.mp3',
'四':'四.mp3',
'五':'五.mp3',
'六':'六.mp3',
'七':'七.mp3',
'八':'八.mp3',
'九':'九.mp3',
'十':'十.mp3',



'吃':'吃.mp3',
'吃饭':'吃饭.mp3',
'饭店':'饭店.mp3',
'包子':'包子.mp3',
'饺子':'饺子.mp3',
'炒饭':'炒饭.mp3',
'炒面':'炒面.mp3',
'菜':'菜.mp3',
'汉堡':'汉堡.mp3',
'牛肉汉堡':'牛肉汉堡.mp3',
'牛肉':'牛肉.mp3',
'肉':'肉.mp3',
'蔬菜':'蔬菜.mp3',
'汤':'汤.mp3',
'面':'面.mp3',
'水':'水.mp3',
'咖啡':'咖啡.mp3',
'牛奶':'牛奶.mp3',
'果汁':'果汁.mp3',
'喝':'喝.mp3',
'好吃':'好吃.mp3',
'好喝':'好喝.mp3',



'东西':'东西.mp3',
'书':'书.mp3',
'笔':'笔.mp3',
'衣服':'衣服.mp3',
'鞋':'鞋.mp3',
'杯':'杯.mp3',
'瓶':'瓶.mp3',
'碗':'碗.mp3',



'中国人':'中国人.mp3',
'这些中国人':'这些中国人.mp3',
'美国人':'美国人.mp3',
'这个美国人':'这个美国人.mp3',
'法国人':'法国人.mp3',



'什么':'什么.mp3',
'是':'是.mp3',
'不是':'不是.mp3',
'不对':'不对.mp3',
'对':'对.mp3',
'有没有':'有没有.mp3',
'有':'有.mp3',
'没有':'没有.mp3',
'多少':'多少.mp3',
'几':'几.mp3',
'这个是什么':'这个是什么.mp3',



'买':'买.mp3',
'去':'去.mp3',
'想':'想.mp3',
'喜欢':'喜欢.mp3',
'要':'要.mp3',
'不要':'不要.mp3',



'和':'和.mp3',
'还是':'还是.mp3',
'那...':'那....mp3',
'那些':'那些.mp3',
'一些':'一些.mp3',
'我的朋友':'我的朋友.mp3',
'我们':'我们.mp3',
'我们要这个':'我们要这个.mp3',
    }

# Asegurar que la carpeta public/audio/ existe
os.makedirs("public/audio", exist_ok=True)

# Descargar cada audio usando la API correcta
for hanzi, filename in words.items():
    url = f"https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q={hanzi}&tl=zh-CN"
    response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})

    if response.status_code == 200:
        with open(f"public/audio/{filename}", "wb") as f:
            f.write(response.content)
        print(f"✅ {filename} descargado correctamente.")
    else:
        print(f"❌ Error al descargar {filename} - Código {response.status_code}")
