var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Enquiry Model
 * =============
 */

var Enquiry = new keystone.List('Enquiry', {
	nocreate: true,
	noedit: true,
});

Enquiry.add({
	name: { type: Types.Name, required: true },
	email: { type: Types.Email },
	phone: { type: String, required: true },
	qq: { type: String },
	babyName: {type: String},
	address: {type: String},
	enquiryType: { type: Types.Select, options: [
		{ value: 'body', label: '男孩' },
		{ value: 'girl', label: '女孩' },
		{ value: 'other', label: '其ta' },
	] },
	message: { type: Types.Markdown, required: true },
	createdAt: { type: Date, default: Date.now },
});

Enquiry.defaultSort = '-createdAt';
Enquiry.defaultColumns = 'name, babyName, phone, createdAt';
Enquiry.register();
