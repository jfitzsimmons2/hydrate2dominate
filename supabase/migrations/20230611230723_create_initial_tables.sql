create sequence "public"."daily_activity_log_id_seq";

create sequence "public"."shared_activity_share_id_seq";

create sequence "public"."user_preferences_user_pref_id_seq";

create table "public"."daily_activity" (
    "log_id" integer not null default nextval('daily_activity_log_id_seq'::regclass),
    "user_id" uuid,
    "goal" integer,
    "amount_logged" integer,
    "log_time" timestamp without time zone default now()
);


create table "public"."shared_activity" (
    "share_id" integer not null default nextval('shared_activity_share_id_seq'::regclass),
    "user_id" uuid,
    "shared_with_id" uuid
);


create table "public"."user_daily_goal" (
    "user_id" uuid not null,
    "goal" integer,
    "goal_date" date default CURRENT_DATE
);


create table "public"."user_preferences" (
    "user_pref_id" integer not null default nextval('user_preferences_user_pref_id_seq'::regclass),
    "user_id" uuid,
    "bottle_size" integer,
    "other_value" integer,
    "goal" integer,
    "total" integer
);


alter sequence "public"."daily_activity_log_id_seq" owned by "public"."daily_activity"."log_id";

alter sequence "public"."shared_activity_share_id_seq" owned by "public"."shared_activity"."share_id";

alter sequence "public"."user_preferences_user_pref_id_seq" owned by "public"."user_preferences"."user_pref_id";

CREATE UNIQUE INDEX daily_activity_pkey ON public.daily_activity USING btree (log_id);

CREATE UNIQUE INDEX shared_activity_pkey ON public.shared_activity USING btree (share_id);

CREATE UNIQUE INDEX user_daily_goal_pkey ON public.user_daily_goal USING btree (user_id);

CREATE UNIQUE INDEX user_preferences_pkey ON public.user_preferences USING btree (user_pref_id);

alter table "public"."daily_activity" add constraint "daily_activity_pkey" PRIMARY KEY using index "daily_activity_pkey";

alter table "public"."shared_activity" add constraint "shared_activity_pkey" PRIMARY KEY using index "shared_activity_pkey";

alter table "public"."user_daily_goal" add constraint "user_daily_goal_pkey" PRIMARY KEY using index "user_daily_goal_pkey";

alter table "public"."user_preferences" add constraint "user_preferences_pkey" PRIMARY KEY using index "user_preferences_pkey";

alter table "public"."daily_activity" add constraint "daily_activity_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."daily_activity" validate constraint "daily_activity_user_id_fkey";

alter table "public"."shared_activity" add constraint "shared_activity_shared_with_id_fkey" FOREIGN KEY (shared_with_id) REFERENCES auth.users(id) not valid;

alter table "public"."shared_activity" validate constraint "shared_activity_shared_with_id_fkey";

alter table "public"."shared_activity" add constraint "shared_activity_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."shared_activity" validate constraint "shared_activity_user_id_fkey";

alter table "public"."user_daily_goal" add constraint "user_daily_goal_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."user_daily_goal" validate constraint "user_daily_goal_user_id_fkey";

alter table "public"."user_preferences" add constraint "user_preferences_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."user_preferences" validate constraint "user_preferences_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.delete_daily_activity_by_date(p_delete_date date)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    DELETE FROM daily_activity
    WHERE DATE(log_time) = p_delete_date;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_activity()
 RETURNS TABLE(log_id integer, user_id uuid, log_time timestamp without time zone, amount_logged integer)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
    SELECT da.log_id, da.user_id, da.log_time, da.amount_logged
    FROM daily_activity as da;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_activity(date_start date, date_end date)
 RETURNS TABLE(log_id integer, user_id uuid, log_time timestamp without time zone, amount_logged integer)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
    SELECT da.log_id, da.user_id, da.log_time, da.amount_logged
    FROM daily_activity as da
    WHERE DATE(da.log_time) BETWEEN date_start AND date_end;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_activity_single_day(date_requested date)
 RETURNS TABLE(log_id integer, user_id uuid, log_time timestamp without time zone, amount_logged integer)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
    SELECT da.log_id, da.user_id, da.log_time, da.amount_logged
    FROM daily_activity as da
    WHERE DATE(da.log_time) = date_requested AND auth.uid() = da.user_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.insert_daily_activity(p_amount_logged integer)
 RETURNS daily_activity
 LANGUAGE plpgsql
AS $function$
DECLARE
  inserted_row daily_activity; -- Declare a variable to store the inserted row
BEGIN
    INSERT INTO daily_activity (user_id, amount_logged, log_time)
    VALUES (auth.uid(), p_amount_logged, current_timestamp)
    RETURNING * INTO inserted_row; -- Capture the inserted row

    RETURN inserted_row; -- Return the inserted row
END;
$function$
;

CREATE OR REPLACE FUNCTION public.insert_daily_activity(p_amount_logged integer, p_log_time timestamp without time zone)
 RETURNS daily_activity
 LANGUAGE plpgsql
AS $function$
DECLARE
  inserted_row daily_activity; -- Declare a variable to store the inserted row
BEGIN
    INSERT INTO daily_activity (user_id, amount_logged, log_time)
    VALUES (auth.uid(), p_amount_logged, p_log_time)
    RETURNING * INTO inserted_row; -- Capture the inserted row

    RETURN inserted_row; -- Return the inserted row
END;
$function$
;

CREATE OR REPLACE FUNCTION public.insert_user_daily_goal(p_goal integer, p_goal_date date)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    INSERT INTO user_daily_goal (user_id, goal, goal_date)
    VALUES (auth.uid(), p_goal, p_goal_date);
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_daily_activity(p_log_id integer, p_amount_logged integer)
 RETURNS daily_activity
 LANGUAGE plpgsql
AS $function$
DECLARE
  updated_row daily_activity; -- Declare a variable to store the updated row
BEGIN
    UPDATE daily_activity
    SET amount_logged = p_amount_logged, log_time = current_timestamp
    WHERE log_id = p_log_id
    RETURNING * INTO updated_row; -- Capture the updated row

    RETURN updated_row; -- Return the updated row
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_user_daily_goal(p_goal integer, p_goal_date date)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE user_daily_goal
    SET goal = p_goal, goal_date = p_goal_date
    WHERE user_id = auth.uid();
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_user_daily_goal(p_user_id uuid, p_goal integer, p_goal_date date)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE user_daily_goal
    SET goal = p_goal, goal_date = p_goal_date
    WHERE user_id = p_user_id;
END;
$function$
;