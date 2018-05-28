import json
with open("./setting.json",'r') as load_f:
    load_dict = json.load(load_f)
    print(load_dict['password'])