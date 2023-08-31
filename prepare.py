import pandas as pd
from string import ascii_uppercase as char_up
from collections import defaultdict
from openpyxl import load_workbook

from openpyxl.utils.dataframe import dataframe_to_rows
import os

def _accumulate_profit_data(workbook, sheet_name, col_range, date_row_num, profit_row_num):
    # ['B16', 'C16', 'D16', 'E16', 'F16', 'G16', 'H16', 'I16', 'J16', 'K16']
    profit_data = defaultdict()
    for cell in col_range:
        date_cell = workbook[sheet_name][(cell + str(date_row_num))]
        profit_cell = workbook[sheet_name][(cell + str(profit_row_num))]
        if date_cell.value:
            date_cell_val = date_cell.value.strftime('%B %Y')
        else:
            date_cell_val = None
        profit_data[date_cell_val] = profit_cell.value
    return profit_data

def _accumulate_eps_data(workbook, sheet_name, col_range, date_row_num, adj_eq_shares_num, net_profit_num):
    eps_data = defaultdict()
    for cell in col_range:
        date_cell = workbook[sheet_name][(cell + str(date_row_num))]
        adj_eq_cell = workbook[sheet_name][(cell + str(adj_eq_shares_num))]
        net_profit_cell = workbook[sheet_name][(cell + str(net_profit_num))]
        # print("")
        # print(sheet_name)
        # print("adj_eq_cell.value")
        # print(adj_eq_cell.value)
        adj_eq_cell_val = adj_eq_cell.value
        if isinstance(adj_eq_cell_val, str):
            fv_val = 7
            col_fv_val = 72
            eq_shares_val = 70
            bonus_shares = 71
            if (
                workbook[sheet_name][(cell + str(eq_shares_val))].value and
                workbook[sheet_name][(cell + str(col_fv_val))].value and
                workbook[sheet_name][(cell + str(fv_val))].value
            ) and workbook[sheet_name][(cell + str(fv_val))].value > 0:
                adj_eq_cell_val = (
                    (
                        # If there is new face value, it will take equity shares of old face value and the no. of equity shares
                        (workbook[sheet_name][(cell + str(eq_shares_val))].value * workbook[sheet_name][(cell + str(col_fv_val))].value)/ workbook[sheet_name][(cell + str(fv_val))].value
                    ) + sum([
                        # This will take bonus shares issued on that time
                        workbook[sheet_name][bonus_share_cell].value for bonus_share_cell in list(map(lambda x: x + str(bonus_shares), col_range[col_range.index(cell) + 1:col_range.index(col_range[-1]) + 1])) if workbook[sheet_name][bonus_share_cell].value
                    ])
                ) / 10000000
            else:
                adj_eq_cell_val = 0
        if adj_eq_cell_val and isinstance(net_profit_cell.value, (int, float)) and adj_eq_cell_val > 0:
            eps_cell = round(net_profit_cell.value / adj_eq_cell_val, 2)
        else:
            eps_cell = 0
        if date_cell.value:
            date_cell_val = date_cell.value.strftime('%B %Y')
        else:
            date_cell_val = None
        eps_data[date_cell_val] = eps_cell
    return eps_data

def _accumulate_net_cash_flow_data(workbook, sheet_name, col_range, date_row_num, net_cash_flow_num):
    net_cash_flow_data = defaultdict()
    for cell in col_range:
        date_cell = workbook[sheet_name][(cell + str(date_row_num))]
        net_cash_flow_cell = workbook[sheet_name][(cell + str(net_cash_flow_num))]
        if date_cell.value:
            date_cell_val = date_cell.value.strftime('%B %Y')
        else:
            date_cell_val = None
        net_cash_flow_data[date_cell_val] = net_cash_flow_cell.value
    return net_cash_flow_data

def _data_accumulation(workbook):
    form_data = defaultdict(dict)
    cell_cols = list(char_up[1:11])
    sheet = 'Data Sheet'

    date_val = 16
    profit_val = 30
    form_data['net_profit'] = _accumulate_profit_data(
        workbook, sheet, cell_cols, date_val, profit_val
    )

    adj_eq_shares_val = 93
    net_profit_val = 30
    form_data['eps'] = _accumulate_eps_data(
        workbook, sheet, cell_cols, date_val, adj_eq_shares_val, net_profit_val
    )

    face_cell_val = 'B7'

    form_data['face_value'] = workbook[sheet][face_cell_val].value

    date_val = 81
    net_cash_flow_val = 85

    form_data['net_cash_flow'] = _accumulate_net_cash_flow_data(
        workbook, sheet, cell_cols, date_val, net_cash_flow_val
    )

    return form_data


# TODO: Fetch it from the path

stock_name = "./EPS_trail/JSW Holdings.xlsx"
stocks = [stock_name]

# Load the Excel file
def stock_data_export(parent_dir, stocks):
    data = defaultdict(dict)
    print(stocks)
    for stock in stocks:
        print("")
        print("stock")
        print(stock)
        print(parent_dir)
        if stock.endswith('.xlsx'):
            workbook = load_workbook(parent_dir + '/' + stock, read_only=False, data_only=False)
            parsing_stock = workbook['Data Sheet']['B1'].value
            if not parsing_stock:
                parsing_stock = stock.split('/')[-1].replace('.xlsx', '')
            data[parsing_stock] = _data_accumulation(workbook)

    return data

    # Create a DataFrame with the cell value
    # df = pd.DataFrame({'Value': cell_values})
