import json
import base64
from PIL import Image
import os


def fetch_aquatone_results() -> dict:
    with open('./aquatone/aquatone_session.json') as f:
        output = f.readlines()

    final_dict = json.loads(output[0])
    return final_dict


def convert_image_paths_to_base64(output) -> dict:
    keys = list(output.keys(['pages'].keys()))
    for key in keys:
        if output[0]['pages'][key]['screenshotPath']:
            path = "./aquatone/" + output[0]['pages'][key]['screenshotPath']
            outpath = "./aquatone/thumbnails/" + output[0]['pages'][key]['screenshotPath']
            os.makedirs(os.path.dirname(outpath), exist_ok=True)
            im = Image.open(path)
            im.thumbnail((128, 128), Image.ANTIALIAS)
            im.save(outpath, "PNG")
            encoded = base64.b64encode(open(path, "rb").read()).decode('ascii')
            thumbnail_encoded = base64.b64encode(open(outpath, "rb").read()).decode('ascii')
            output[0]['pages'][key]['screenshotPath'] = "data:image/png;base64,{}".format(encoded)
            output[0]['pages'][key]['thumbnailPath'] = "data:image/png;base64,{}".format(thumbnail_encoded)
    return output