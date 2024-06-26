import csv

fname = 'questiondata.csv'                         
outfname = 'minimally_formatted_questiondata.csv'  
header = ['gender', 'age', 'experience', 'condition',
          'purple_bot_associate_bumble', 'purple_bot_associate_honey',
          'yellow_bot_associate_bumble', 'yellow_bot_associate_honey',
          'eerieness_1', 'eerieness_2', 'eerieness_3',
          'godspeed_1', 'godspeed_2', 'godspeed_3', 'godspeed_4', 'godspeed_5',
          'mdmt_bumble_1', 'mdmt_bumble_2', 'mdmt_bumble_3', 'mdmt_bumble_4',
          'mdmt_bumble_5', 'mdmt_bumble_6', 'mdmt_bumble_7', 'mdmt_bumble_8',
          'mdmt_bumble_checkbox_1', 'mdmt_bumble_checkbox_2', 'mdmt_bumble_checkbox_3', 'mdmt_bumble_checkbox_4',
          'mdmt_bumble_checkbox_5', 'mdmt_bumble_checkbox_6', 'mdmt_bumble_checkbox_7', 'mdmt_bumble_checkbox_8',
          'mdmt_honey_1', 'mdmt_honey_2', 'mdmt_honey_3', 'mdmt_honey_4',
          'mdmt_honey_5', 'mdmt_honey_6', 'mdmt_honey_7', 'mdmt_honey_8',
          'mdmt_honey_checkbox_1', 'mdmt_honey_checkbox_2', 'mdmt_honey_checkbox_3', 'mdmt_honey_checkbox_4',
          'mdmt_honey_checkbox_5', 'mdmt_honey_checkbox_6', 'mdmt_honey_checkbox_7', 'mdmt_honey_checkbox_8',
          'mdmt_purple_1', 'mdmt_purple_2', 'mdmt_purple_3', 'mdmt_purple_4',
          'mdmt_purple_5', 'mdmt_purple_6', 'mdmt_purple_7', 'mdmt_purple_8',        
          'mdmt_purple_checkbox_1', 'mdmt_purple_checkbox_2', 'mdmt_purple_checkbox_3', 'mdmt_purple_checkbox_4',
          'mdmt_purple_checkbox_5', 'mdmt_purple_checkbox_6', 'mdmt_purple_checkbox_7', 'mdmt_purple_checkbox_8',
          'mdmt_yellow_1', 'mdmt_yellow_2', 'mdmt_yellow_3', 'mdmt_yellow_4',
          'mdmt_yellow_5', 'mdmt_yellow_6', 'mdmt_yellow_7', 'mdmt_yellow_8',
          'mdmt_yellow_checkbox_1', 'mdmt_yellow_checkbox_2', 'mdmt_yellow_checkbox_3', 'mdmt_yellow_checkbox_4',
          'mdmt_yellow_checkbox_5', 'mdmt_yellow_checkbox_6', 'mdmt_yellow_checkbox_7', 'mdmt_yellow_checkbox_8',
          'final_check_question']

computedheader= ['eerie','humanlike','trust_bumble','trust_honey','trust_purple','trust_yellow','honey_yellow_trust_difference','bumble_purple_trust_difference']

checkArr = {}
with open(fname, 'r') as f:
    reader = csv.reader(f, delimiter=',')
    for row in reader:
        if len(row[0]) != 32:
            print(row[0])
        if row[0] not in checkArr:
            checkArr[row[0]] = ['']*(len(header))
        checkArr[row[0]][header.index(row[1])] = row[2]

with open(outfname, 'w') as outf:   #newline=''
    writer = csv.writer(outf, delimiter=',')
    # sort output by age
    writer.writerow(['id'] + header)
    #writer.writerow(header) #+ ['id']
    for item in sorted(checkArr.items(), key=lambda x: x[1][header.index('condition')]):
        #if '' in item[1]:
        #    print('Incomplete row:', item)
        #    continue
        writer.writerow([item[0]]+item[1])
