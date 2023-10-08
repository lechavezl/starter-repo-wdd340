-- Insert new data to table 'account'
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Changing the Tony Start user account_type to 'Admin'
UPDATE account SET account_type = 'Admin' WHERE account_id = 1;

-- Delete the Tony Stark record
DELETE FROM account WHERE account_id = 1;

-- UPDATE the "GM Hummer" record to read "a huge interior" rather than "small interiors"
UPDATE
	inventory
SET
	inv_description = REPLACE (
		inv_description,
		'the small interiors',
		'a huge interior')
WHERE inv_id = 10;

-- SELECT the inv_make and inv_model from inventory table and
-- classification_name from classification table and return
-- the related values based on the primary and foreing key
SELECT
	inventory.inv_make, inventory.inv_model, classification.classification_name
FROM
	public.inventory
INNER JOIN public.classification
	ON inventory.classification_id = classification.classification_id
WHERE
	classification.classification_name = 'Sport';

-- UPDATE the inv_image and inv_thumbnail from inventory table to teplace
-- the /images/ substring for /images/vehicles/.
UPDATE inventory
SET
	inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/')
WHERE
	inv_image LIKE '%images/%' OR inv_thumbnail LIKE '%/images%/';