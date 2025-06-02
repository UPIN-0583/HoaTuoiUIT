from torchvision.models import resnet50, ResNet50_Weights
from torchvision import transforms
from PIL import Image
import torch

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
weights = ResNet50_Weights.DEFAULT
resnet = resnet50(weights=weights).to(device)
resnet.eval()

preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def extract_vector(image_bytes):
    image = Image.open(image_bytes).convert('RGB')
    img_tensor = preprocess(image).unsqueeze(0).to(device)
    with torch.no_grad():
        vector = resnet(img_tensor)
    return vector.cpu().numpy().flatten()
