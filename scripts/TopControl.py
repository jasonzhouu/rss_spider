"""
This is used to control the whole news recommend system operation
"""

from ContentEngine import ContentEngine
import datetime
import pandas as pd
import numpy as np
import jieba.analyse
from sklearn.metrics.pairwise import cosine_similarity
import json
with open("./setting.json",'r') as load_f:
    load_dict = json.load(load_f)

if __name__ == '__main__':
    print('\n======================== \n  start analysing ...\n======================== \n')

    # initialize jieba
    jieba.analyse.set_stop_words("stopwords.txt")

    my_engine = ContentEngine('localhost', 'root', load_dict['password'], 'rss')

    # read updated news (in the latest 24h) from database
    now_date = datetime.datetime.now().strftime("%Y-%m-%d") + " 03:00:00"
    yesterday = datetime.datetime.now() - datetime.timedelta(1)
    yesterday = yesterday.strftime("%Y-%m-%d") + " 03:00:00"
    now_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    sql = "SELECT id, title, content FROM articles WHERE created_at BETWEEN " + "'" + yesterday + "' AND " + "'" + now_time + "';"
    lines = my_engine.execute_sql(sql)

    print("\n======================== \n    读取文章 " + str(len(lines)) + " 篇\n======================== \n")

    update_news = pd.DataFrame()  # store update news
    for line in lines:
        # clean news content
        # print(line[2])
        if line[2] is None:
            print('empty content id = ', line[0])
        else:
            clean_content = my_engine.clean_content(line[2])
            one_news = pd.DataFrame({'newsid': str(line[0]), 'title': line[1], 'content': clean_content}, index=[0])
            # print(one_news)
            update_news = update_news.append(one_news, ignore_index=True)

    # convert news to vector
    news_vector = dict()  # store updated news vectors
    for i in update_news.index:
        news_id = update_news.newsid[i]
        one_title_vector = my_engine.get_news_vector(update_news.title[i])
        one_news_vector = my_engine.get_news_vector(update_news.content[i])
        news_vector[news_id] = one_title_vector + one_news_vector
        print('news vector', news_vector[news_id])

    # update user interesting model and recommend news
    # read the latest 50 recordings
    sql = "SELECT article_id FROM reading_history_articles WHERE user_id=1 ORDER BY created_at DESC LIMIT 50;"
    rcd_tuple = my_engine.execute_sql(sql)
    rcd_list = [str(rcd[0]) for rcd in rcd_tuple]  # recording id list
    # if not rcd_list:
    #     # if no recordings, continue
    #     continue;

    # compute eim of user
    user_eim = np.zeros(len(my_engine.feature_sequence))
    for rcd in rcd_list:
        print('article history: ', rcd)
        sql = "SELECT title, content FROM articles WHERE id=" + rcd + ";"
        news = my_engine.execute_sql(sql)
        news_title = news[0][0]
        news_content = my_engine.clean_content(news[0][1])

        content_vector = my_engine.get_news_vector(news_content)
        title_vector = my_engine.get_news_vector(news_title)
        user_eim += content_vector + title_vector

    user_eim = user_eim / len(rcd_list)

    # recommend news
    recommend_result = pd.DataFrame(columns=['newsid', 'similarity'])

    for newsid, one_news_vector in news_vector.items():
        similarity = cosine_similarity(user_eim[np.newaxis, :],
                                        one_news_vector[np.newaxis, :])
        one_result = pd.DataFrame({'newsid': newsid,
                                    'similarity': similarity[0][0]},
                                    index=[0])
        recommend_result = recommend_result.append(one_result, ignore_index=True)

    recommend_result = recommend_result.sort_values(by='similarity', ascending=False)

    # write recommend result to database
    caculate_hash = hash(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    for index, row in recommend_result.iterrows():
        user_id = "1"
        article_id = row.newsid
        similarity = str(row.similarity)
        created_at = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        sql = "INSERT INTO recommend_articles (article_id, user_id, similarity, created_at) VALUES ('" + article_id + "', '" + user_id + "', '" + similarity + "', '" + created_at + "');"
        my_engine.execute_sql(sql, commit=True)

        recommend_result.drop(recommend_result.index, inplace=True)