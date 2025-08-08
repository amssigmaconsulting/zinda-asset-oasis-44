-- Create a function to handle credit purchases and deductions
CREATE OR REPLACE FUNCTION public.update_user_credits(
  user_id_param UUID,
  amount_param INTEGER,
  transaction_type_param TEXT,
  description_param TEXT DEFAULT NULL,
  stripe_session_id_param TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Update the user's credit balance
  UPDATE public.credits 
  SET 
    balance = balance + amount_param,
    updated_at = now()
  WHERE user_id = user_id_param;
  
  -- Insert a transaction record
  INSERT INTO public.credit_transactions (
    user_id,
    amount,
    type,
    description,
    stripe_session_id
  ) VALUES (
    user_id_param,
    amount_param,
    transaction_type_param,
    description_param,
    stripe_session_id_param
  );
END;
$$;

-- Create a function to check if user has enough credits
CREATE OR REPLACE FUNCTION public.has_sufficient_credits(
  user_id_param UUID,
  required_credits INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  SELECT balance INTO current_balance
  FROM public.credits
  WHERE user_id = user_id_param;
  
  RETURN COALESCE(current_balance, 0) >= required_credits;
END;
$$;