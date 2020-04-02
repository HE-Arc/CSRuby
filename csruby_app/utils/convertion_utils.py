
def convert_arg_to_float(str):
    try:
        if str:
            return float(str)
        return None
    except:
        return None

def convert_arg_to_int(str):
    try:
        if str:
            return int(str)
        return None
    except:
        return None
