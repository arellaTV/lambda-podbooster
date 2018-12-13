FROM amazonlinux:2017.03.0.20170812

WORKDIR /root

RUN yum update -y && yum install -y \
    gcc44 \
    gcc-c++ \
    libgcc44 \
    cmake \
    git

# Install node
RUN curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -
RUN yum install nodejs -y && npm install -g serverless

CMD npm install

