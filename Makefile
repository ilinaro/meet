start:
	docker-compose up -d

stop:
	docker-compose down

clean:
	docker-compose down -v
	docker system prune -f

rebuild:
	docker-compose build
	docker-compose up -d

restart:
	docker-compose restart