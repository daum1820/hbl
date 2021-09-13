provider "aws" {
  version = "~> 2.0"
  region  = "eu-central-1" # Setting my region to London. Use your own region here
}

resource "aws_ecs_cluster" "hbl_prod_cluster" {
  name = "hbl-prod-cluster" # Naming the cluster
}

resource "aws_ecs_task_definition" "hbl_app_task" {
  family                   = "hbl-app-task" # Naming our first task
  container_definitions    = <<DEFINITION
  [
    {
      "name": "hbl-api",
      "image": "792945024296.dkr.ecr.eu-central-1.amazonaws.com/hbl-api:api-latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 3000,
          "hostPort": 3000
        }
      ],
      "secrets": [{
        "name": "HBL_API_SECRET",
        "valueFrom": "arn:aws:secretsmanager:eu-central-1:792945024296:secret:prod/Hbl/api-olJTDY"
      }],
      "memory": 512,
      "cpu": 256
    },
    {
      "name": "hbl-ui",
      "image": "792945024296.dkr.ecr.eu-central-1.amazonaws.com/hbl-ui:ui-latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 3001,
          "hostPort": 3001
        }
      ],
      "environment": [{
        "name": "REACT_APP_BASE_URL",
        "value": "api/"
      }],
      "memory": 512,
      "cpu": 256
    }
  ]
  DEFINITION
  requires_compatibilities = ["EC2"] # Stating that we are using ECS EC2
  network_mode             = "awsvpc"
  memory                   = 1024         # Specifying the memory our container requires
  cpu                      = 512         # Specifying the CPU our container requires
  execution_role_arn       = "${aws_iam_role.ecsTaskExecutionRole.arn}"
}

resource "aws_iam_role" "ecsTaskExecutionRole" {
  name               = "ecsTaskExecutionRole"
  assume_role_policy = "${data.aws_iam_policy_document.assume_role_policy.json}"
}

data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "ecsTaskExecutionRole_policy" {
  role       = "${aws_iam_role.ecsTaskExecutionRole.name}"
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_ecs_service" "hbl_app_service" {
  name            = "hbl-app-service"                             # Naming our first service
  cluster         = "${aws_ecs_cluster.hbl_prod_cluster.id}"             # Referencing our created Cluster
  task_definition = "${aws_ecs_task_definition.hbl_app_task.arn}" # Referencing the task our service will spin up
  launch_type     = "EC2"
  desired_count   = 1

  load_balancer {
    target_group_arn = "${aws_lb_target_group.hbl_api_target_group.arn}" # Referencing our target group
    container_name   = "hbl-api"
    container_port   = 3000 # Specifying the container port
  }
  
  load_balancer {
    target_group_arn = "${aws_lb_target_group.hbl_ui_target_group.arn}" # Referencing our target group
    container_name   = "hbl-ui"
    container_port   = 3001 # Specifying the container port
  }

  network_configuration {
    subnets          = ["${aws_default_subnet.default_subnet_a.id}", "${aws_default_subnet.default_subnet_b.id}"]
    security_groups  = ["${aws_security_group.hbl_prod_service_sg.id}"]
  }
}

resource "aws_security_group" "hbl_prod_service_sg" {
  ingress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    # Only allowing traffic in from the load balancer security group
    security_groups = ["${aws_security_group.hbl_alb_sg.id}"]
  }

  egress {
    from_port   = 0 # Allowing any incoming port
    to_port     = 0 # Allowing any outgoing port
    protocol    = "-1" # Allowing any outgoing protocol 
    cidr_blocks = ["0.0.0.0/0"] # Allowing traffic out to all IP addresses
  }
}

resource "aws_default_vpc" "default_vpc" {
}

# Providing a reference to our default subnets
resource "aws_default_subnet" "default_subnet_a" {
  availability_zone = "eu-central-1a"
}

# Providing a reference to our default subnets
resource "aws_default_subnet" "default_subnet_b" {
  availability_zone = "eu-central-1b"
}

resource "aws_alb" "hbl_alb" {
  name               = "hbl-alb-tf" # Naming our load balancer
  load_balancer_type = "application"
  subnets = [ # Referencing the default subnets
    "${aws_default_subnet.default_subnet_a.id}",
    "${aws_default_subnet.default_subnet_b.id}"
  ]

  # Referencing the security group
  security_groups = ["${aws_security_group.hbl_alb_sg.id}"]
}

# Creating a security group for the load balancer:
resource "aws_security_group" "hbl_alb_sg" {
  ingress {
    from_port   = 80 # Allowing traffic in from port 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Allowing traffic in from all sources
  }

  egress {
    from_port   = 0 # Allowing any incoming port
    to_port     = 0 # Allowing any outgoing port
    protocol    = "-1" # Allowing any outgoing protocol 
    cidr_blocks = ["0.0.0.0/0"] # Allowing traffic out to all IP addresses
  }
}

resource "aws_lb_target_group" "hbl_api_target_group" {
  name        = "hbl-api-target-group"
  port        = 80
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = "${aws_default_vpc.default_vpc.id}" # Referencing the default VPC
  health_check {
    matcher = "200,301,302"
    path = "/api/health_check"
  }
}

resource "aws_lb_target_group" "hbl_ui_target_group" {
  name        = "hbl-ui-target-group"
  port        = 80
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = "${aws_default_vpc.default_vpc.id}" # Referencing the default VPC
  health_check {
    matcher = "200,301,302"
    path = "/"
  }
}

resource "aws_lb_listener" "hbl_listener" {
  load_balancer_arn = "${aws_alb.hbl_alb.arn}" # Referencing our load balancer
  port              = "80"
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = "${aws_lb_target_group.hbl_ui_target_group.arn}" # Referencing our target group
  }
}

resource "aws_lb_listener_rule" "hbl-api-listener" {
  listener_arn = aws_lb_listener.hbl_listener.arn
  priority = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.hbl_api_target_group.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}