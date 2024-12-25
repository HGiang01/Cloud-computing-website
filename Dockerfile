# dùng image của Python
FROM python:3.12

# chọn thư mục làm việc
WORKDIR /Grocery_Website

# tải các thư viện cần thiết được quy định sẵn trong file requirements.txt
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

# copy toàn bộ file vào thư mục làm việc
COPY . . 

# xuất cống 8080 cho web
EXPOSE 8080
# chạy app trong file sever bằng cổng 8080 dùng gunicorn để hỗ trợ chuyển đổi HTTP Request 
CMD ["gunicorn", "-b", "0.0.0.0:8080", "server:app"]

