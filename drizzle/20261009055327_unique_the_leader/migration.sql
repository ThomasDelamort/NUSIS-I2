CREATE TABLE "admin" (
	"admin_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "admin_admin_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"refid_uid" varchar(15) NOT NULL UNIQUE,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"university_email" varchar(255) NOT NULL UNIQUE,
	"phone_number" varchar(20),
	"profile_picture_url" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_logs" (
	"log_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "daily_logs_log_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"student_id" integer NOT NULL,
	"time_in" timestamp with time zone NOT NULL,
	"time_out" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "students" (
	"student_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "students_student_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"refid_uid" varchar(15) NOT NULL UNIQUE,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"university_id" varchar(20) NOT NULL UNIQUE,
	"university_email" varchar(255) NOT NULL UNIQUE,
	"phone_number" varchar(20),
	"profile_picture_url" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "users";--> statement-breakpoint
ALTER TABLE "daily_logs" ADD CONSTRAINT "daily_logs_student_id_students_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("student_id");