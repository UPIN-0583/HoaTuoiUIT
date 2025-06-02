import torch
from torchvision import models, transforms
from PIL import Image
import io
from app.flower_names import flower_names

num_classes = 102
model = models.resnet50(weights=None)  # pretrained=False tương đương với weights=None
model.fc = torch.nn.Linear(model.fc.in_features, num_classes)
model.load_state_dict(torch.load('app/resnet50_flowers_model.pth', map_location='cpu'))
model.eval()

preprocess = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def predict_flower(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img_tensor = preprocess(image).unsqueeze(0)
    with torch.no_grad():
        outputs = model(img_tensor)
        _, predicted = outputs.max(1)
        flower_type = flower_names[predicted.item()]
    return flower_type
