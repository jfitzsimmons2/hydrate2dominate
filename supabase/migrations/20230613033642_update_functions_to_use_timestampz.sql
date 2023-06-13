drop function if exists "public"."insert_daily_activity"(p_amount_logged integer, p_log_time timestamp without time zone);

drop function if exists "public"."get_user_activity"();

drop function if exists "public"."get_user_activity"(date_start date, date_end date);

drop function if exists "public"."get_user_activity_single_day"(date_requested date);

alter table "public"."daily_activity" alter column "log_time" set data type timestamp with time zone using "log_time"::timestamp with time zone;

alter table "public"."daily_activity" enable row level security;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.insert_daily_activity(p_amount_logged integer, p_log_time timestamp with time zone)
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

CREATE OR REPLACE FUNCTION public.get_user_activity()
 RETURNS TABLE(log_id integer, user_id uuid, log_time timestamp with time zone, amount_logged integer)
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
 RETURNS TABLE(log_id integer, user_id uuid, log_time timestamp with time zone, amount_logged integer)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
    SELECT da.log_id, da.user_id, da.log_time, da.amount_logged
    FROM daily_activity as da
    WHERE da.log_time BETWEEN date_start AND date_end;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_activity_single_day(date_requested date)
 RETURNS TABLE(log_id integer, user_id uuid, log_time timestamp with time zone, amount_logged integer)
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

create policy "Can only operate if they match the logged in user"
on "public"."daily_activity"
as permissive
for all
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));