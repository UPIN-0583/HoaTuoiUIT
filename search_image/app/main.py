from fastapi import FastAPI, UploadFile, File
from app.flower_model import predict_flower
from app.feature_extractor import extract_vector
import requests
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import io
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Chỉ cho phép Next.js gọi
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_images_from_springboot(flower_type):
    springboot_url = "http://localhost:8080/api/products/by-flower"
    params = {'englishName': flower_type}
    response = requests.get(springboot_url, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        return []
    

def compare_user_image(user_vector, flower_type, top_k=3):
    products = get_images_from_springboot(flower_type)
    if not products:
        return [{"error": f"No products found for flower type '{flower_type}'"}]

    vectors = []
    product_info = []
    for p in products:
        image_url = p['imageUrl']
        full_url = "http://localhost:8080" + image_url
        try:
            img_data = requests.get(full_url).content
            vec = extract_vector(io.BytesIO(img_data))
            vectors.append(vec)
            product_info.append({'product': p, 'vector': vec})
        except Exception as e:
            print(f"Error processing image {full_url}: {e}")

    if not vectors:
        return [{"error": "No vectors extracted from images"}]

    sims = cosine_similarity([user_vector], np.array(vectors))[0]
    top_indices = sims.argsort()[-top_k:][::-1]
    results = []
    for i in top_indices:
        prod = product_info[i]['product']
        prod['fullImageUrl'] = "http://localhost:8080" + prod['imageUrl']
        results.append({'product': prod, 'similarity': float(sims[i])})
    return results

@app.post("/search-by-image")
async def search_by_image(file: UploadFile = File(...)):
    contents = await file.read()
    flower_type = predict_flower(contents)
    user_vector = extract_vector(io.BytesIO(contents))
    similar_products = compare_user_image(user_vector, flower_type, top_k=3)
    return {"flower_type": flower_type, "similar_products": similar_products}
